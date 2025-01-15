import NDK, {
  NDKEvent,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import {
  eventId,
  fetchEvents,
  fetchOutboxRelays,
  fetchProfile,
  tags,
  tv,
} from "libnostrsite";
import { createContext } from "react";
import { SERVER_PUBKEY, SITE_RELAY } from "./consts";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { MIN_POW, minePow } from "./pow";
import { nip19 } from "nostr-tools";
import { NPUB_PRO_API } from "@/consts";

export const AuthContext = createContext<{
  isAuth: boolean;
  isLoading: boolean;
}>({
  isAuth: false,
  isLoading: false,
});

export const DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.primal.net",
  "wss://relay.damus.io",
  "wss://purplepag.es",
  SITE_RELAY,
];
export const SEARCH_RELAYS = ["wss://relay.nostr.band/"];
const onAuths: ((type: string) => Promise<void>)[] = [];

export let ndk: NDK = new NDK({
  explicitRelayUrls: DEFAULT_RELAYS,
});
ndk.connect();

export let userPubkey: string = "";
export const userRelays: string[] = [];
export let userProfile: NDKEvent | undefined = undefined;
export let userIsDelegated = false;
export let userIsReadOnly = false;
export let userToken = "";
let userTokenPubkey = "";
const outboxCache = new Map<string, string[]>();

const KIND_NIP98 = 27235;
const KIND_DELETE = 5;

try {
  userToken = window.localStorage.getItem("token") || "";
  userTokenPubkey = window.localStorage.getItem("tokenPubkey") || "";
} catch {}

export function srm(e: NDKEvent | NostrEvent, name: string, name1?: string) {
  if (!name1) e.tags = e.tags.filter((t) => t.length < 2 || t[0] !== name);
  else
    e.tags = e.tags.filter(
      (t) => t.length < 3 || t[0] !== name || t[1] !== name1,
    );
}

export function stv(e: NDKEvent | NostrEvent, name: string, value: string) {
  const t = e.tags.find((t) => t.length >= 2 && t[0] === name);
  if (t) t[1] = value;
  else e.tags.push([name, value]);
}

export function stv2(
  e: NDKEvent | NostrEvent,
  prefix: string,
  name: string,
  value: string,
) {
  const t = e.tags.find(
    (t) => t.length >= 3 && t[0] === prefix && t[1] === name,
  );
  if (t) t[2] = value;
  else e.tags.push([prefix, name, value]);
}

export function stv3(
  e: NDKEvent | NostrEvent,
  prefix: string,
  name: string,
  subname: string,
  value: string,
) {
  const t = e.tags.find(
    (t) =>
      t.length >= 4 && t[0] === prefix && t[1] === name && t[2] === subname,
  );
  if (t) t[3] = value;
  else e.tags.push([prefix, name, subname, value]);
}

export function stag(e: NDKEvent | NostrEvent, tag: string[]) {
  const i = e.tags.findIndex((t) => t.length >= 2 && t[0] === tag[0]);
  if (i < 0) e.tags.push(tag);
  else e.tags[i] = tag;
}

export function addOnAuth(cb: (type: string) => Promise<void>) {
  onAuths.push(cb);
}

function setUserToken(token: string, pubkey: string) {
  console.log("set token", pubkey, token);
  userToken = token;
  userTokenPubkey = pubkey;
  try {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("tokenPubkey", pubkey);
  } catch {}
}

export async function getOutboxRelays(pubkey: string) {
  const c = outboxCache.get(pubkey);
  if (c) return c;

  const relays = [
    ...new Set([
      ...(await fetchOutboxRelays(ndk, [pubkey])),
      ...DEFAULT_RELAYS,
    ]),
  ];

  outboxCache.set(pubkey, relays);
  return relays;
}

export async function onAuth(e: any) {
  console.log("nlAuth", e);
  const authed = e.detail.type !== "logout";
  if (authed) {
    userPubkey = await window.nostr!.getPublicKey();
    console.log("pubkey", userPubkey);

    userIsDelegated = e.detail.method === "otp";
    userIsReadOnly = e.detail.method === "readOnly";
    if (userIsDelegated) {
      setUserToken(JSON.parse(e.detail.otpData).token, userPubkey);
    } else if (userTokenPubkey !== userPubkey) {
      setUserToken("", "");
    }

    const outboxRelays = await getOutboxRelays(userPubkey);
    userRelays.push(...outboxRelays);
    console.log("pubkey relays", userRelays);

    userProfile = await fetchProfile(ndk, userPubkey);

    localStorage.setItem("localUserPubkey", userPubkey);
  } else {
    userPubkey = "";
    userRelays.length = 0;
    userProfile = undefined;
    setUserToken("", "");
    localStorage.removeItem("localUserPubkey");
  }

  for (const cb of onAuths) await cb(e.detail.type);

  return authed;
}

async function fetchAuthed({
  ndk,
  url,
  method = "GET",
  body = undefined,
  pow = 0,
}: {
  ndk: NDK;
  url: string;
  method?: string;
  body?: string;
  pow?: number;
}) {
  let authEvent = new NDKEvent(ndk, {
    pubkey: userPubkey,
    kind: KIND_NIP98,
    created_at: Math.floor(Date.now() / 1000),
    content: "",
    tags: [
      ["u", url],
      ["method", method],
    ],
  });
  if (body) authEvent.tags.push(["payload", bytesToHex(sha256(body))]);

  // generate pow on auth event
  if (pow) {
    const start = Date.now();
    const powEvent = authEvent.rawEvent();
    const minedEvent = minePow(powEvent, pow);
    console.log(
      "mined pow of",
      pow,
      "in",
      Date.now() - start,
      "ms",
      minedEvent,
    );
    authEvent = new NDKEvent(ndk, minedEvent);
  }

  authEvent.sig = await authEvent.sign(new NDKNip07Signer());
  console.log("signed", JSON.stringify(authEvent.rawEvent()));

  const auth = btoa(JSON.stringify(authEvent.rawEvent()));

  return await fetch(url, {
    method,
    credentials: "include",
    headers: {
      Authorization: `Nostr ${auth}`,
    },
    body,
  });
}

async function getSessionToken() {
  let pow = MIN_POW;
  do {
    try {
      const r = await fetchAuthed({
        ndk,
        url: `${NPUB_PRO_API}/auth?npub=${nip19.npubEncode(userPubkey)}`,
        pow,
      });

      if (r.status === 200) {
        const data = await r.json();
        console.log("got session token", data);
        setUserToken(data.token, userPubkey);
        // done!
        return;
      } else if (r.status === 403) {
        const rep = await r.json();
        console.log("need more pow", rep);
        pow = rep.minPow;
      } else {
        throw new Error("Bad reply " + r.status);
      }
    } catch (e) {
      console.log("Error", e);
      break;
    }
  } while (pow < MIN_POW + 5);

  throw new Error("Failed to get session token");
}

export async function fetchWithSession(
  url: string,
  body: any | undefined = undefined,
  method?: string,
) {
  url = `${NPUB_PRO_API}${url}`;
  try {
    method = method || (body ? "POST" : "GET");
    const fetchIt = async () => {
      const headers: any = {
        "X-NpubPro-Token": userToken,
      };
      if (body) headers["Content-Type"] = "application/json";

      return await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    };

    const r = await fetchIt();

    if (r.status === 200) return r;
    if (r.status === 401) {
      if (userIsDelegated) {
        // token expired, we can't get a new one without
        // user interaction (without them retrying to sign-in),
        // so we force a logout and see what happens...
        document.dispatchEvent(new Event("nlLogout"));
        throw new Error("Session expired");
      } else {
        // ensure we're authed
        await getSessionToken();
        // retry
        return fetchIt();
      }
    } else {
      return r;
    }
  } catch (e) {
    console.log("fetch error", e);
    throw e;
  }
}

export async function publishSiteEvent(
  site: NDKEvent,
  relays: string[],
): Promise<NostrEvent> {
  // if we're signed in with OTP
  // or if we're editing delegated site
  if (userIsDelegated || (site.pubkey === SERVER_PUBKEY && tv(site, "u"))) {
    if (site.pubkey !== SERVER_PUBKEY)
      throw new Error("Cannot edit site signed by your keys in delegated mode");
    const reply = await fetchWithSession(
      `/site?relays=${relays.join(",")}`,
      site.rawEvent(),
    );
    if (reply.status !== 200) throw new Error("Failed to publish event");

    const data = await reply.json();
    console.log("signed by server site event", data.event);
    if (eventId(data.event) !== eventId(site))
      throw new Error("Changed site id");

    return data.event;
  } else {
    if (site.pubkey !== userPubkey) throw new Error("Not your site");

    // ensure updated date
    site.created_at = Math.floor(Date.now() / 1000);

    // sign it
    await site.sign(new NDKNip07Signer());
    console.log("signed site event", site);

    // publish
    const set = NDKRelaySet.fromRelayUrls(relays, ndk);
    console.log("publishing to relays", relays, set);

    const r = await site.publish(set);
    console.log(
      "published site event to",
      [...r].map((r) => r.url),
    );
    if (!r.size) throw new Error("Failed to publish to relays");

    return site.rawEvent();
  }
}

export async function deleteSiteEvent(site: NostrEvent, relays: string[]) {
  if (userIsDelegated || (site.pubkey === SERVER_PUBKEY && tv(site, "u"))) {
    if (site.pubkey !== SERVER_PUBKEY)
      throw new Error(
        "Cannot delete site signed by your keys in delegated mode",
      );

    const naddr = nip19.naddrEncode({
      identifier: tv(site, "d") || "",
      pubkey: site.pubkey,
      kind: site.kind!,
    });

    const reply = await fetchWithSession(
      `/site?relays=${relays.join(",")}&site=${naddr}&id=${site.id}`,
      undefined,
      "DELETE",
    );
    if (reply.status !== 200) throw new Error("Failed to delete site");

    const data = await reply.json();
    console.log("deleted by server", data);
  } else {
    if (site.pubkey !== userPubkey) throw new Error("Not your site");

    // del req for site event
    const delReq = new NDKEvent(ndk, {
      kind: KIND_DELETE,
      content: "",
      pubkey: userPubkey,
      created_at: site.created_at! + 1,
      tags: [
        ["e", site.id!],
        ["a", `${site.kind}:${site.pubkey}:${tv(site, "d")}`],
      ],
    });

    // sign it
    await delReq.sign(new NDKNip07Signer());
    console.log("signed delete site request", delReq);

    // publish
    const r = await delReq.publish(NDKRelaySet.fromRelayUrls(relays, ndk));
    console.log(
      "published delete site request to",
      [...r].map((r) => r.url),
    );
    if (!r.size) throw new Error("Failed to publish to relays");
  }
}

function isPRE(kind: number) {
  return kind >= 30000 && kind < 40000;
}

function isRE(kind: number) {
  return kind === 0 || kind === 3 || (kind >= 10000 && kind < 20000);
}

function formatAddr(e: NDKEvent | NostrEvent) {
  return `${e.kind!}:${e.pubkey!}:${tv(e, "d") || ""}`;
}

export async function filterDeleted(events: NDKEvent[], relays: string[]) {
  const idFilter = {
    kinds: [KIND_DELETE],
    ids: [] as string[],
  };
  const addrFilter = {
    kinds: [KIND_DELETE],
    "#a": [] as string[],
  };
  for (const e of events.values()) {
    if (isPRE(e.kind!) || isRE(e.kind!)) {
      addrFilter["#a"].push(formatAddr(e));
    } else {
      idFilter.ids.push(e.id);
    }
  }
  const filters = [];
  if (idFilter.ids.length) filters.push(idFilter);
  if (addrFilter["#a"].length) filters.push(addrFilter);
  if (!filters.length) return;

  const dels = await fetchEvents(ndk, filters, relays, 3000);
  for (const d of dels.values()) {
    const i = events.findIndex((e) => {
      if (isPRE(e.kind!)) {
        return tags(d, "a").find((t) => t[1] === formatAddr(e));
      } else {
        return tags(d, "e").find((t) => t[1] === e.id);
      }
    });
    if (i >= 0) {
      console.log("deleted event", i, events[i], d);
      events.splice(i, 1);
    }
  }
}
