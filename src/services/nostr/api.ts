import {
  NDKEvent,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { ReturnSettingsSiteDataType } from "../sites.service";
import {
  NostrParser,
  Site,
  SiteAddr,
  tv,
} from "libnostrsite";
import { SITE_RELAY, addOnAuth, ndk, userPubkey, userRelays, stv } from "./nostr";

const KIND_SITE = 30512;

const sites: Site[] = [];
const parser = new NostrParser("http://localhost/");

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
    NDKRelaySet.fromRelayUrls([...userRelays, SITE_RELAY], ndk)
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
    relays: userRelays,
  };
  return parser.parseSite(addr, e);
}

export async function fetchSites() {
  console.log("fetchSites", userPubkey);
  if (!userPubkey) throw new Error("Auth please");

  if (!sites.length) {
    const events = await ndk.fetchEvents(
      {
        // @ts-ignore
        kinds: [KIND_SITE],
        authors: [userPubkey],
      },
      { groupable: false },
      NDKRelaySet.fromRelayUrls(userRelays, ndk!)
    );
    console.log("site events", events);

    for (const e of events.values()) {
      sites.push(parseSite(e.rawEvent()));
    }
  }

  return convertSites(sites);
}

addOnAuth(async (type: string) => {
  // clear sites on logout
  if (type === "logout") sites.length = 0;
})