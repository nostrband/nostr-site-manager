import {
  NDKEvent,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { ReturnSettingsSiteDataType } from "../sites.service";
import {
  KIND_PACKAGE,
  KIND_PROFILE,
  NostrParser,
  OUTBOX_RELAYS,
  Site,
  SiteAddr,
  eventId,
  tv,
} from "libnostrsite";
import {
  addOnAuth,
  ndk,
  userPubkey,
  userRelays,
  stv,
  SEARCH_RELAYS,
  srm,
  publishSite,
} from "./nostr";
import { nip19 } from "nostr-tools";
import { SERVER_PUBKEY, SITE_RELAY } from "./consts";

const KIND_SITE = 30512;

const sites: Site[] = [];
const packageThemes = new Map<string, string>();
const parser = new NostrParser("http://localhost/");

export async function editSite(data: ReturnSettingsSiteDataType) {
  const index = sites.findIndex((s) => s.id === data.id);
  if (index < 0) throw new Error("Unknown site");
  const s = sites[index];

  const e = s.event;
  stv(e, "name", data.name);
  stv(e, "title", data.title);
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
  srm(e, "nav");
  // write nav back
  for (const n of data.navigation.primary) {
    e.tags.push(["nav", n.link, n.title]);
  }

  // remove p
  srm(e, "p");
  // write p back
  for (const p of data.contributors) {
    e.tags.push(["p", p]);
  }

  await publishSite(new NDKEvent(ndk, e), [...userRelays, SITE_RELAY]);

  // parse updated site back
  sites[index] = parseSite(e);
}

function convertSites(sites: Site[]): ReturnSettingsSiteDataType[] {
  return sites.map((s) => ({
    id: s.id,
    themeId: packageThemes.get(s.extensions?.[0].event_id || "") || "",
    themeName: s.extensions?.[0].petname || "",
    contributors: s.contributor_pubkeys,
    hashtags:
      s.include_tags?.filter((t) => t.tag === "t").map((t) => "#" + t.value) ||
      [],
    kinds: s.include_kinds?.map((k) => parseInt(k)) || [1],
    accentColor: s.accent_color || "",
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

async function fetchSiteThemes() {
  const events = await ndk.fetchEvents(
    {
      // @ts-ignore
      kinds: [KIND_PACKAGE],
      ids: sites
        .map((s) => s.extensions?.[0].event_id || "")
        .filter((id) => !!id),
    },
    { groupable: false },
    NDKRelaySet.fromRelayUrls([SITE_RELAY], ndk!)
  );

  for (const e of events) {
    const a = tv(e, "a") || "";
    const naddr = nip19.naddrEncode({
      kind: parseInt(a.split(":")[0]),
      pubkey: a.split(":")[1],
      identifier: a.split(":")[2],
    });
    packageThemes.set(e.id, naddr);
  }
}

function parseSite(ne: NostrEvent) {
  const e = new NDKEvent(ndk, ne);
  const addr: SiteAddr = {
    // FIXME add typefor lib
    // @ts-ignore
    identifier: tv(e, "d") || "",
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
      [
        // owned
        {
          // @ts-ignore
          kinds: [KIND_SITE],
          authors: [userPubkey],
        },
        // delegated
        {
          authors: [SERVER_PUBKEY],
          // @ts-ignore
          kinds: [KIND_SITE],
          "#u": [userPubkey],
        },
      ],
      { groupable: false },
      NDKRelaySet.fromRelayUrls(userRelays, ndk!)
    );
    console.log("site events", events);

    // sort by timestamp desc
    const array = [...events.values()].sort(
      (a, b) => b.created_at! - a.created_at!
    );

    sites.push(...array.map((e) => parseSite(e.rawEvent())));

    await fetchSiteThemes();
  }

  return convertSites(sites);
}

addOnAuth(async (type: string) => {
  // clear sites on logout
  if (type === "logout") sites.length = 0;
});

const profileCache = new Map<string, NDKEvent | null>();

export async function fetchProfiles(pubkeys: string[]): Promise<NDKEvent[]> {
  const res = [];
  const req = [];
  for (const p of pubkeys) {
    const c = profileCache.get(p);
    if (c === undefined) {
      req.push(p);
    } else if (c !== null) {
      res.push(c);
    }
  }

  if (!req.length) return res;

  const events = await ndk.fetchEvents(
    {
      kinds: [KIND_PROFILE],
      authors: req,
    },
    { groupable: false },
    NDKRelaySet.fromRelayUrls(OUTBOX_RELAYS, ndk)
  );

  for (const e of events) {
    profileCache.set(e.pubkey, e);
    res.push(e);
  }

  for (const p of req) {
    if (!profileCache.get(p)) profileCache.set(p, null);
  }

  return res;
}

export async function searchProfiles(text: string): Promise<NDKEvent[]> {
  const events = await ndk.fetchEvents(
    {
      kinds: [KIND_PROFILE],
      search: text + " sort:popular",
      limit: 3,
    },
    {
      groupable: false,
    },
    NDKRelaySet.fromRelayUrls(SEARCH_RELAYS, ndk)
  );

  for (const e of events) {
    profileCache.set(e.pubkey, e);
  }

  return [...events];
}
