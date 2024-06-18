// import { authed } from "@/modules/auth/nostr-login";
import NDK, {
  NDKEvent,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { ReturnSettingsSiteDataType } from "../sites.service";
import { authed } from "@/components/Layout/AppWrapper";
import {
  NostrParser,
  Site,
  SiteAddr,
  fetchOutboxRelays,
  tv,
} from "libnostrsite";

const KIND_SITE = 30512;

const SITE_RELAY = "wss://relay.npubpro.com";
const DEFAULT_RELAYS = [
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://purplepag.es",
  SITE_RELAY,
];
let ndkUserPubkey: string = "";
let ndk: NDK | undefined;
const relays: string[] = [];
const sites: Site[] = [];
const parser = new NostrParser("http://localhost/");

async function ensureNdk(pubkey: string) {
  if (ndkUserPubkey && ndkUserPubkey !== pubkey) {
    for (const r of ndk!.pool.relays.values()) {
      r.disconnect();
    }

    sites.length = 0;
    relays.length = 0;
  }

  ndkUserPubkey = pubkey;
  ndk = new NDK({
    explicitRelayUrls: DEFAULT_RELAYS,
  });
  ndk.connect();
}

// function parseSite(e: NDKEvent) {
//   const id = nip19.naddrEncode({
//     identifier: tv(e, "d") || "",
//     kind: KIND_SITE,
//     pubkey: e.pubkey,
//     relays: [],
//   });

//   // @ts-ignore
//   const settings: ReturnSettingsSiteDataType = {
//     id,
//     event: e.rawEvent(),

//     name: tv(e, "d"),

//     url: new URL(tv(e, "r")).pathname,

//     // contributor_pubkeys: tags(e, "p").map((t) => t[1]),
//     // include_tags: tags(event, "include", 3).map((t) => ({
//     //   tag: t[1],
//     //   value: t[2],
//     // })),
//     // include_all: !!tags(event, "include", 2).find((t) => t[1] === "*"),
//     // include_manual: !!tags(event, "include", 2).find((t) => t[1] === "?"),
//     // include_kinds: tags(event, "kind").map((t) => t[1]),
//     // include_relays: tags(event, "relay").map((t) => t[1]),

//     // engine: tv(event, "x") || undefined,
//     // themes: tags(event, "y").map((t) => t[1]),
//     // plugins: tags(event, "z").map((t) => t[1]),

//     title: tv(e, "title"),
//     timezone: { name: "UTC", label: "UTC" },
//     description: tv(e, "summary"),
//     logo: tv(e, "logo"),
//     icon: tv(e, "icon"),
//     image: tv(e, "image"),
//     language: tv(e, "lang"),

//     // navigation: tags(event, "nav", 3).map((t) => ({
//     //   label: t[2],
//     //   url: t[1],
//     // })),
//     // secondary_navigation: [],
//     metaTitle: tv(e, "meta_title"),
//     metaDescription: tv(e, "meta_description"),
//     ogImage: tv(e, "og_image"),
//     ogTitle: tv(e, "og_title"),
//     ogDescription: tv(e, "og_description"),
//     xImage: tv(e, "twitter_image"),
//     xTitle: tv(e, "twitter_title"),
//     xDescription: tv(e, "twitter_description"),

//     // extensions: tags(event, "x", 5).map((x) => ({
//     //   event_id: x[1],
//     //   relay: x[2],
//     //   package_hash: x[3],
//     //   petname: x[4],
//     // })),

//     // config: new Map(),
//     // custom: new Map(),
//     fTitle: "",
//     fDescription: "",
//     socialAccountFaceBook: "",
//     socialAccountX: "",
//     isPrivate: false,
//     password: "",
//   };

//   return settings;
// }

function stv(e: NostrEvent, name: string, value: string) {
  const t = e.tags.find((t) => t.length >= 2 && t[0] === name);
  if (t) t[1] = value;
  else e.tags.push([name, value]);
}

export async function editSite(data: ReturnSettingsSiteDataType) {
  const index = sites.findIndex((s) => s.id === data.id);
  if (index < 0) throw new Error("Unknown site");
  const s = sites[index];

  const e = s.event;
  stv(e, "d", data.name);
  stv(e, "name", data.title);
  stv(e, "summary", data.description);
  stv(e, "r", data.url);
  stv(e, "icon", data.icon);
  stv(e, "logo", data.logo);
  stv(e, "image", data.image);
  stv(e, "lang", data.language);
  stv(e, "meta_description", data.metaDescription);
  stv(e, "meta_title", data.metaTitle);
  stv(e, "og_description", data.ogDescription);
  stv(e, "og_title", data.ogTitle);
  stv(e, "og_image", data.ogImage);
  stv(e, "twitter_title", data.xTitle);
  stv(e, "twitter_description", data.xDescription);
  stv(e, "twitter_image", data.xImage);

  // remove nav
  e.tags = e.tags.filter((t) => t.length < 2 || t[0] !== "nav");
  // write nav back
  for (const n of data.navigation.primary) {
    e.tags.push(["nav", n.link, n.title]);
  }

  const ne = new NDKEvent(ndk, {
    ...e,
    // force update
    created_at: Math.floor(Date.now() / 1000),
    // reset
    id: undefined,
  });
  console.log("edited site event", ne.rawEvent());

  const signer = new NDKNip07Signer();
  await ne.sign(signer);

  const r = await ne.publish(
    NDKRelaySet.fromRelayUrls([...relays, SITE_RELAY], ndk!)
  );
  if (!r.size) {
    throw new Error("Failed to publish to relays");
  }

  // parse updated site back
  sites[index] = parseSite(e);
}

function convertSites(sites: Site[]): ReturnSettingsSiteDataType[] {
  return sites.map((s) => ({
    id: s.id,
    name: s.name,
    title: s.title || "",
    description: s.description || "",
    // @ts-ignore
    url: tv(s.event, "r") || "",
    icon: s.icon || "",
    logo: s.logo || "",
    image: s.cover_image || "",
    language: s.lang || "",
    timezone: { name: "", label: "" },
    metaDescription: s.meta_description || "",
    metaTitle: s.meta_title || "",
    ogDescription: s.og_description || "",
    ogTitle: s.og_title || "",
    ogImage: s.og_image || "",
    xTitle: s.twitter_title || "",
    xImage: s.twitter_image || "",
    xDescription: s.twitter_description || "",
    fTitle: "",
    fDescription: "",
    socialAccountFaceBook: "",
    socialAccountX: "",

    navigation: {
      primary:
        s.navigation?.map((n) => ({
          title: n.label,
          link: n.url,
          id: n.url,
        })) || [],
      secondary:
        s.secondary_navigation?.map((n) => ({
          title: n.label,
          link: n.url,
          id: n.url,
        })) || [],
    },
  }));
}

function parseSite(ne: NostrEvent) {
  const e = new NDKEvent(ndk, ne);
  const addr: SiteAddr = {
    name: tv(e, "d") || "",
    pubkey: e.pubkey,
    relays,
  };
  return parser.parseSite(addr, e);
}

export async function fetchSites() {
  console.log("fetchSites", authed);
  if (!authed) throw new Error("Auth please");

  const pubkey = await window.nostr!.getPublicKey();
  console.log("pubkey", pubkey);
  await ensureNdk(pubkey);
  if (!sites.length) {
    if (!ndk) throw new Error("No ndk");

    const outboxRelays = await fetchOutboxRelays(ndk!, [pubkey]);
    relays.push(...outboxRelays);
    console.log("pubkey relays", relays);

    const events = await ndk!.fetchEvents(
      {
        // @ts-ignore
        kinds: [KIND_SITE],
        authors: [pubkey],
      },
      { groupable: false },
      NDKRelaySet.fromRelayUrls(relays, ndk!)
    );
    console.log("site events", events);

    for (const e of events.values()) {
      sites.push(parseSite(e.rawEvent()));
    }
  }

  return convertSites(sites);
}
