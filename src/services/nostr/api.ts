import { authed } from "@/modules/auth/nostr-login";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { ReturnSettingsSiteDataType } from "../sites.service";
import { nip19 } from "nostr-tools";

const KIND_SITE = 30512;

const DEFAULT_RELAYS = [
  "wss://relay.nostr.band",
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://purplepag.es",
];
let ndkUserPubkey: string = "";
let ndk: NDK | undefined;

async function ensureNdk(pubkey: string) {
  if (ndkUserPubkey && ndkUserPubkey !== pubkey) {
    for (const r of ndk!.pool.relays.values()) {
      r.disconnect();
    }
  }

  ndk = new NDK({
    explicitRelayUrls: DEFAULT_RELAYS,
  });
  ndk.connect();
}

function tags(event: NDKEvent, name: string, len: number = 2): string[][] {
  return event.tags.filter((t) => t.length >= len && t[0] === name);
}

function tag(event: NDKEvent, name: string): string[] | null {
  return tags(event, name)?.[0];
}

function tvs(event: NDKEvent, name: string): string[] | null {
  return tag(event, name)?.slice(1) || null;
}

function tv(event: NDKEvent, name: string): string {
  return tvs(event, name)?.[0] || "";
}

function parseSite(e: NDKEvent) {
  const id = nip19.naddrEncode({
    identifier: tv(e, "d") || "",
    kind: KIND_SITE,
    pubkey: e.pubkey,
    relays: [],
  });

  // @ts-ignore
  const settings: ReturnSettingsSiteDataType = {
    id,
    event: e.rawEvent(),

    name: tv(e, "d"),

    url: new URL(tv(e, "r")).pathname,

    // contributor_pubkeys: tags(e, "p").map((t) => t[1]),
    // include_tags: tags(event, "include", 3).map((t) => ({
    //   tag: t[1],
    //   value: t[2],
    // })),
    // include_all: !!tags(event, "include", 2).find((t) => t[1] === "*"),
    // include_manual: !!tags(event, "include", 2).find((t) => t[1] === "?"),
    // include_kinds: tags(event, "kind").map((t) => t[1]),
    // include_relays: tags(event, "relay").map((t) => t[1]),

    // engine: tv(event, "x") || undefined,
    // themes: tags(event, "y").map((t) => t[1]),
    // plugins: tags(event, "z").map((t) => t[1]),

    title: tv(e, "title"),
    timezone: { name: "UTC", label: "UTC" },
    description: tv(e, "summary"),
    logo: tv(e, "logo"),
    icon: tv(e, "icon"),
    image: tv(e, "image"),
    language: tv(e, "lang"),

    // navigation: tags(event, "nav", 3).map((t) => ({
    //   label: t[2],
    //   url: t[1],
    // })),
    // secondary_navigation: [],
    metaTitle: tv(e, "meta_title"),
    metaDescription: tv(e, "meta_description"),
    ogImage: tv(e, "og_image"),
    ogTitle: tv(e, "og_title"),
    ogDescription: tv(e, "og_description"),
    xImage: tv(e, "twitter_image"),
    xTitle: tv(e, "twitter_title"),
    xDescription: tv(e, "twitter_description"),

    // extensions: tags(event, "x", 5).map((x) => ({
    //   event_id: x[1],
    //   relay: x[2],
    //   package_hash: x[3],
    //   petname: x[4],
    // })),

    // config: new Map(),
    // custom: new Map(),
    fTitle: "",
    fDescription: "",
    socialAccountFaceBook: "",
    socialAccountX: "",
    isPrivate: false,
    password: "",
  };

  return settings;
}

export async function fetchSites() {
  console.log("fetchSites", authed);
  if (!authed) throw new Error("Auth please");

  const pubkey = await window.nostr!.getPublicKey();
  console.log("pubkey", pubkey);
  await ensureNdk(pubkey);

  const events = await ndk!.fetchEvents(
    {
      // @ts-ignore
      kinds: [KIND_SITE],
      authors: [pubkey],
    },
    { groupable: false },
  );
  console.log("site events", events);

  return [...events].map((e) => parseSite(e));
}
