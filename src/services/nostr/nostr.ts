import NDK, { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import { fetchOutboxRelays, fetchProfile, tv } from "libnostrsite";
import { nip19 } from "nostr-tools";
import { createContext } from "react";

export const AuthContext = createContext<boolean>(false);
export const SITE_RELAY = "wss://relay.npubpro.com";
export const DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://purplepag.es",
  SITE_RELAY,
];
const onAuths: ((type: string) => Promise<void>)[] = [];

export let ndk: NDK = new NDK({
  explicitRelayUrls: DEFAULT_RELAYS,
});
ndk.connect();

export let userPubkey: string = "";
export const userRelays: string[] = [];
export let userProfile: NDKEvent | null = null;

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

export function eventAddr(e: NDKEvent) {
  return {
    identifier: tv(e, "d") || "",
    pubkey: e.pubkey,
    kind: e.kind || 0,
  };
}

export function eventId(e: NDKEvent) {
  if (
    e.kind === 0 ||
    e.kind === 3 ||
    // @ts-ignore
    (e.kind >= 10000 && e.kind < 20000) ||
    // @ts-ignore
    (e.kind >= 30000 && e.kind < 40000)
  ) {
    return nip19.naddrEncode(eventAddr(e));
  } else {
    return nip19.noteEncode(e.id);
  }
}

export function addOnAuth(cb: (type: string) => Promise<void>) {
  onAuths.push(cb);
}

export async function onAuth(e: any) {
  console.log("nlAuth", e);
  const authed = e.detail.type !== "logout";
  if (authed) {
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
