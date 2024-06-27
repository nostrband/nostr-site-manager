import NDK, { NDKEvent, NDKNip07Signer, NDKRelaySet, NostrEvent } from "@nostr-dev-kit/ndk";
import { eventId, fetchOutboxRelays, fetchProfile } from "libnostrsite";
import { createContext } from "react";
import { SITE_RELAY } from "./consts";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import { MIN_POW, minePow } from "./pow";
import { NPUB_PRO_API } from "@/consts";
import { nip19 } from "nostr-tools";

export const AuthContext = createContext<boolean>(false);
export const DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://purplepag.es",
  SITE_RELAY,
];
export const SEARCH_RELAYS = ["wss://relay.nostr.band"];
const onAuths: ((type: string) => Promise<void>)[] = [];

export let ndk: NDK = new NDK({
  explicitRelayUrls: DEFAULT_RELAYS,
});
ndk.connect();

export let userPubkey: string = "";
export const userRelays: string[] = [];
export let userProfile: NDKEvent | null = null;
export let userIsDelegated = false;
export let userToken = "";

export function srm(e: NDKEvent | NostrEvent, name: string) {
  e.tags = e.tags.filter((t) => t.length < 2 || t[0] !== name);
}

export function stv(e: NDKEvent | NostrEvent, name: string, value: string) {
  const t = e.tags.find((t) => t.length >= 2 && t[0] === name);
  if (t) t[1] = value;
  else e.tags.push([name, value]);
}

export function stag(e: NDKEvent | NostrEvent, tag: string[]) {
  const i = e.tags.findIndex((t) => t.length >= 2 && t[0] === tag[0]);
  if (i < 0) e.tags.push(tag);
  else e.tags[i] = tag;
}

export function addOnAuth(cb: (type: string) => Promise<void>) {
  onAuths.push(cb);
}

export async function onAuth(e: any) {
  console.log("nlAuth", e);
  const authed = e.detail.type !== "logout";
  if (authed) {
    userToken = "";
    userIsDelegated = e.detail.method === "otp";
    if (userIsDelegated) {
      userToken = JSON.parse(e.detail.otpData).token;
    }

    userPubkey = await window.nostr!.getPublicKey();
    console.log("pubkey", userPubkey);

    const outboxRelays = await fetchOutboxRelays(ndk, [userPubkey]);
    userRelays.push(...outboxRelays);
    console.log("pubkey relays", userRelays);

    userProfile = await fetchProfile(ndk, userPubkey);
  } else {
    userPubkey = "";
    userRelays.length = 0;
    userProfile = null;
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
    kind: 27235,
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
      minedEvent
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
        userToken = data.token;
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
  body: any | undefined = undefined
) {
  try {
    const method = body ? "POST" : "GET";
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

export async function publishSite(site: NDKEvent, relays: string[]): Promise<NostrEvent> {
  if (userIsDelegated) {
    const reply = await fetchWithSession(
      `${NPUB_PRO_API}/site?relays=${relays.join(",")}`,
      site.rawEvent()
    );
    if (reply.status !== 200) throw new Error("Failed to publish event");

    const data = await reply.json();
    console.log("signed by server site event", data.event);
    if (eventId(data.event) !== eventId(site)) throw new Error("Changed site id");

    return data.event;
  } else {
    // sign it
    await site.sign(new NDKNip07Signer());
    console.log("signed site event", site);

    // publish
    const r = await site.publish(NDKRelaySet.fromRelayUrls(relays, ndk));
    console.log(
      "published site event to",
      [...r].map((r) => r.url)
    );
    if (!r.size) throw new Error("Failed to publish to relays");

    return site.rawEvent();
  }
}
