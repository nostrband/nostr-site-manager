import { SiteAddr, fetchEvents, parseAddr } from "libnostrsite";
import { STATS_RELAYS, addOnAuth, ndk, userNip46, userPubkey } from "./nostr";
import { NDKEvent, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

const KIND_STATS = 1995;

export interface SiteStats {
  last7d: {
    totals: {
      visitors: number;
      pageviews: number;
      signups: number;
      auths: number;
      reactions: number;
    };
    users: {
      visit: number;
      pageview: number;
      signup: number;
      auth: number;
      react: number;
    };
    pubkeys: string[];
  };
}

interface Content {
  type: string;
  site: string;
  user?: string;
  payload: {
    url: string;
    ua: string;
    ref?: string;
    data?: any;
  };
}

interface StatsEvent {
  event: NDKEvent;
  content: Content;
  addr: SiteAddr;
}

const events: StatsEvent[] = [];

addOnAuth(async (type) => {
  if (type === "logout") {
    // reset cache
    events.length = 0;
  }
});

async function loadEvents() {
  // 1 week
  let since = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;

  if (events.length) since = events[events.length - 1].event.created_at! + 1;

  const newEvents = await fetchEvents(
    ndk,
    {
      // @ts-ignore
      kinds: [KIND_STATS],
      "#p": [userPubkey],
      since,
    },
    STATS_RELAYS,
    5000
  );

  const promises: Promise<void>[] = [];
  let lowLatency = false;
  for (const event of newEvents) {
    const process = async () => {
      try {
        const content = JSON.parse(
          // NOTE: talk directly to nostr-login bcs
          // NDKNip07Signer only supports single-threaded access
          // @ts-ignore
          await window.nostr.nip04.decrypt(event.pubkey, event.content)
        );
        console.log("stats event", content, event);

        events.push({
          event,
          content,
          addr: parseAddr(content.site),
        });
      } catch (e) {
        console.log("bad event", e, event);
      }
    };

    // NOTE: all key access methods except nip46 are fast so
    // we can decrypt one-by-one. With nip46 we can send
    // all requests in parallel (but beware - relay might be
    // upset), but first we have to check that user
    // has given permission for auto-decrypt without auth_url
    if (userNip46) {
      // protect against sending many reqs to a bunker
      // that will require manual approval
      if (!lowLatency) {
        const start = Date.now();
        await process();
        lowLatency = Date.now() - start < 3000;
      } else {
        promises.push(process());
      }
    } else await process();
  }
  await Promise.all(promises);
}

export async function fetchSiteStats(id: string) {
  await loadEvents();

  const addr = parseAddr(id);
  const siteEvents = events.filter(
    (e) =>
      e.addr.identifier === addr.identifier && e.addr.pubkey === addr.pubkey
  );

  const pubkeys = new Set<string>();
  for (const e of siteEvents) {
    if (e.content.user) pubkeys.add(e.content.user);
  }

  const stats: SiteStats = {
    last7d: {
      totals: {
        visitors: siteEvents.length,
        pageviews: siteEvents.filter((e) => e.content.type === "pageview")
          .length,
        auths: siteEvents.filter(
          (e) =>
            e.content.type === "event" &&
            e.content.payload.data?.action === "auth" &&
            e.content.payload.data?.authType !== "logout"
        ).length,
        signups: siteEvents.filter(
          (e) =>
            e.content.type === "event" &&
            e.content.payload.data?.action === "auth" &&
            e.content.payload.data?.authType === "signup"
        ).length,
        reactions: siteEvents.filter(
          (e) =>
            e.content.type === "event" &&
            e.content.payload.data?.action === "event-published"
        ).length,
      },
      users: {
        visit: new Set(siteEvents.map((e) => e.event.pubkey)).size,
        pageview: new Set(
          siteEvents
            .filter((e) => e.content.type === "pageview")
            .map((e) => e.event.pubkey)
        ).size,
        auth: new Set(
          siteEvents
            .filter(
              (e) =>
                e.content.type === "event" &&
                e.content.payload.data?.action === "auth" &&
                e.content.payload.data?.authType !== "logout"
            )
            .map((e) => e.event.pubkey)
        ).size,
        signup: new Set(
          siteEvents
            .filter(
              (e) =>
                e.content.type === "event" &&
                e.content.payload.data?.action === "auth" &&
                e.content.payload.data?.authType === "signup"
            )
            .map((e) => e.event.pubkey)
        ).size,
        react: new Set(
          siteEvents
            .filter(
              (e) =>
                e.content.type === "event" &&
                e.content.payload.data?.action === "event-published"
            )
            .map((e) => e.event.pubkey)
        ).size,
      },
      pubkeys: [...pubkeys],
    },
  };

  return stats;
}
