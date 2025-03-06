import { SiteAddr, fetchEvents, parseAddr } from "libnostrsite";
import { STATS_RELAYS, addOnAuth, ndk, userNip46, userPubkey } from "./nostr";
import { NDKEvent, NDKNip07Signer, NDKUser } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

const KIND_STATS = 1995;

export interface SiteStats {
  last7d: {
    totals: {
      // all page views
      pageviews: number;
      // sessions
      visits: number;
      // unique visitors
      visitors: number;
      // user pubkeys
      npubs: number;
      // new users
      signups: number;
      // events published by users on the site
      reactions: number;
    };
    // users: {
    //   visit: number;
    //   pageview: number;
    //   signup: number;
    //   auth: number;
    //   react: number;
    // };
    pubkeys: string[];
  };
}

interface Content {
  type: string;
  site: string;
  vid: string;
  user?: string;
  url: string;
  ref?: string;
  data?: any;
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
  console.log("stats loaded events since", since, newEvents);

  const promises: Promise<void>[] = [];
  let lowLatency = false;
  let index = 0;
  for (const event of newEvents) {
    const process = async () => {
      try {
        // spread the requests a bit if we're parallelizing
        if (promises.length)
          await new Promise((ok) => setTimeout(ok, index * 50));

        index++;
        const content = JSON.parse(
          // NOTE: talk directly to nostr-login bcs
          // NDKNip07Signer only supports single-threaded access
          // @ts-ignore
          await window.nostr.nip04.decrypt(event.pubkey, event.content)
        );
        // console.log("stats event", content, event);

        // invalid
        if (!content.url) return;

        if (!events.find((e) => e.event.id === event.id)) {
          events.push({
            event,
            content,
            addr: parseAddr(content.site),
          });
        }
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

  // ASC sort
  events.sort((a, b) => a.event.created_at! - b.event.created_at!);
  // console.log("stats events", events.map(e => e.event.rawEvent()));
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

  const uid = (e: StatsEvent) => {
    return e.content.user || e.content.vid;
  }

  let visitMap = new Map<string, number> ();
  let visits = 0;
  for (const e of siteEvents) {
    if (e.content.type !== "pageview") continue;
    const lastTm = visitMap.get(uid(e)) || 0;
    if ((e.event.created_at! - lastTm) > 3600) visits++;
    visitMap.set(uid(e), e.event.created_at!);
  }

  const stats: SiteStats = {
    last7d: {
      totals: {
        pageviews: siteEvents.filter((e) => e.content.type === "pageview")
          .length,
        visits,
        visitors: new Set(siteEvents.map((e) => uid(e))).size,
        // auths: siteEvents.filter(
        //   (e) =>
        //     e.content.type === "event" &&
        //     e.content.payload.data?.action === "auth" &&
        //     e.content.payload.data?.authType !== "logout"
        // ).length,
        signups: siteEvents.filter(
          (e) =>
            e.content.type === "auth" &&
            e.content.data?.type === "signup"
        ).length,
        reactions: siteEvents.filter(
          (e) =>
            e.content.type === "event" &&
            e.content.data?.action === "event-published"
        ).length,
        npubs: new Set(
          siteEvents.filter((e) => e.content.user).map((e) => e.content.user)
        ).size,
      },
      // users: {
      //   visit: new Set(siteEvents.map((e) => e.event.pubkey)).size,
      //   pageview: new Set(
      //     siteEvents
      //       .filter((e) => e.content.type === "pageview")
      //       .map((e) => e.event.pubkey)
      //   ).size,
      //   auth: new Set(
      //     siteEvents
      //       .filter(
      //         (e) =>
      //           e.content.type === "event" &&
      //           e.content.payload.data?.action === "auth" &&
      //           e.content.payload.data?.authType !== "logout"
      //       )
      //       .map((e) => e.event.pubkey)
      //   ).size,
      //   signup: new Set(
      //     siteEvents
      //       .filter(
      //         (e) =>
      //           e.content.type === "event" &&
      //           e.content.payload.data?.action === "auth" &&
      //           e.content.payload.data?.authType === "signup"
      //       )
      //       .map((e) => e.event.pubkey)
      //   ).size,
      //   react: new Set(
      //     siteEvents
      //       .filter(
      //         (e) =>
      //           e.content.type === "event" &&
      //           e.content.payload.data?.action === "event-published"
      //       )
      //       .map((e) => e.event.pubkey)
      //   ).size,
      // },
      pubkeys: [...pubkeys],
    },
  };

  return stats;
}
