import {
  NDKEvent,
  NDKFilter,
  NDKKind,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { ReturnSettingsSiteDataType } from "../sites.service";
import {
  KIND_PACKAGE,
  KIND_PROFILE,
  KIND_SITE,
  NostrParser,
  OUTBOX_RELAYS,
  Post,
  Site,
  SiteAddr,
  createSiteFilters,
  fetchEvents,
  fetchEvent,
  tv,
  matchPostsToFilters,
  parseAddr,
  parseATag,
  eventId,
} from "libnostrsite";
import {
  addOnAuth,
  ndk,
  userPubkey,
  userRelays,
  stv,
  SEARCH_RELAYS,
  srm,
  publishSiteEvent,
  fetchWithSession,
  deleteSiteEvent,
  filterDeleted,
  stv3,
  userIsDelegated,
} from "./nostr";
import { nip19 } from "nostr-tools";
import { SERVER_PUBKEY, SITE_RELAY } from "./consts";
import { NPUB_PRO_DOMAIN } from "@/consts";
import { fetchSubmits } from "./content";
import { Mutex } from "./utils";

// FIXME reuse decls from libnostrsite
const KIND_PINNED_ON_SITE = 30516;

const sites: Site[] = [];
const packageThemes = new Map<string, string>();
export const parser = new NostrParser("http://localhost/");
let sitesPromise: Promise<void> | undefined = undefined;

const profileCache = new Map<string, NDKEvent | null>();
const profileFetchMutex = new Mutex();

export function hasSite(id: string) {
  return sites.findIndex((s) => s.id === id) >= 0;
}

export function findSiteEvent(id: string) {
  return sites.find((s) => s.id === id)?.event;
}

export async function editSite(data: ReturnSettingsSiteDataType) {
  const index = sites.findIndex((s) => s.id === data.id);
  if (index < 0) throw new Error("Unknown site");
  const s = sites[index];

  const oldUrl = tv(s.event, "r");

  // need to re-deploy?
  let domain = "";
  let oldDomain = "";
  try {
    const u = new URL(data.url);
    if (!u.pathname.endsWith("/")) throw new Error("Path must end with /");
    if (u.hostname.endsWith("." + NPUB_PRO_DOMAIN)) {
      const sub = u.hostname.split("." + NPUB_PRO_DOMAIN)[0];
      if (!sub || sub.includes(".")) throw new Error("Bad sub domain");
      if (u.search) throw new Error("No query string allowed");
      if (u.pathname !== "/")
        throw new Error("Only / path allowed on " + NPUB_PRO_DOMAIN);
      domain = sub;
    }
    if (oldUrl) {
      const ou = new URL(oldUrl);
      if (ou.hostname.endsWith("." + NPUB_PRO_DOMAIN))
        oldDomain = ou.hostname.split("." + NPUB_PRO_DOMAIN)[0];
    }
  } catch (e) {
    console.log("url error", data.url, e);
    throw e;
  }

  const e = s.event;
  stv(e, "name", data.name);
  stv(e, "title", data.title);
  stv(e, "summary", data.description);
  stv(e, "r", data.url);
  stv(e, "icon", data.icon);
  stv(e, "logo", data.logo);
  stv(e, "image", data.image);
  stv(e, "color", data.accentColor);
  stv(e, "lang", data.language);
  stv(e, "meta_description", data.metaDescription);
  stv(e, "meta_title", data.metaTitle);
  stv(e, "og_description", data.ogDescription);
  stv(e, "og_title", data.ogTitle);
  stv(e, "og_image", data.ogImage);
  stv(e, "twitter_title", data.xTitle);
  stv(e, "twitter_description", data.xDescription);
  stv(e, "twitter_image", data.xImage);

  // DEPRECATED
  // stv2(e, "config", "codeinjection_head", data.codeinjection_head);
  // stv2(e, "config", "codeinjection_foot", data.codeinjection_foot);

  // DEPRECATED
  srm(e, "config");

  // new way
  srm(e, "settings", "core");
  stv3(e, "settings", "core", "codeinjection_head", data.codeinjection_head);
  stv3(e, "settings", "core", "codeinjection_foot", data.codeinjection_foot);
  // ensure it's string!
  stv3(e, "settings", "core", "posts_per_page", "" + data.postsPerPage);
  if (data.signupStartNjump)
    stv3(e, "settings", "core", "nostr_login.signup_start_njump", "true");

  // FIXME move to plugin settings later
  stv3(e, "settings", "core", "content_cta_main", data.contentActionMain);
  stv3(
    e,
    "settings",
    "core",
    "content_cta_list",
    data.contentActions.join(","),
  );

  // nav
  srm(e, "nav");
  for (const n of data.navigation.primary)
    e.tags.push(["nav", n.link, n.title]);

  // p tags
  srm(e, "p");
  for (const p of [...new Set(data.contributors)]) e.tags.push(["p", p]);

  // edit tags
  srm(e, "include");
  if (data.autoSubmit) {
    for (const t of [...new Set(data.hashtags)])
      e.tags.push(["include", "t", t.replace("#", "")]);
    if (!data.hashtags.length) stv(e, "include", "*");
  }
  for (const t of [...new Set(data.hashtags_homepage)])
    e.tags.push(["include", "t", t.replace("#", ""), "", "homepage"]);

  // edit kinds
  srm(e, "kind");
  for (const k of [...new Set(data.kinds)]) e.tags.push(["kind", k + ""]);
  for (const k of [...new Set(data.kinds_homepage)])
    e.tags.push(["kind", k + "", "", "homepage"]);

  const relays = [...userRelays, SITE_RELAY];
  const naddr = nip19.naddrEncode({
    identifier: tv(e, "d") || "",
    pubkey: e.pubkey,
    kind: e.kind!,
    relays,
  });

  // ensure new domain is reserved
  // console.log("domain", domain, "oldDomain", oldDomain);
  if (domain && domain !== oldDomain) {
    const reply = await fetchWithSession(
      `/reserve?domain=${domain}&site=${naddr}&no_retry=true`,
    );
    if (reply.status !== 200) throw new Error("Failed to reserve");
    const r = await reply.json();
    console.log(Date.now(), "reserved", r);
  }

  console.log("Signing", e);

  // publish new site event
  await publishSiteEvent(new NDKEvent(ndk, e), relays);

  // redeploy if domain changed, also release the old domain
  // if (oldDomain && oldDomain !== domain)
  {
    const reply = await fetchWithSession(
      // from=oldDomain - delete the old site after 7 days
      `/deploy?domain=${domain}&site=${naddr}&from=${oldDomain}`,
    );
    if (reply.status !== 200) throw new Error("Failed to deploy");

    const r = await reply.json();
    console.log(Date.now(), "deployed", r);
  }

  // parse updated site back
  sites[index] = parseSite(e);
}

export async function deleteSite(siteId: string) {
  const index = sites.findIndex((s) => s.id === siteId);
  if (index < 0) throw new Error("Unknown site");
  const site = sites[index];

  // delete from relays first
  const relays = [...userRelays, SITE_RELAY];
  await deleteSiteEvent(site.event, relays);

  // delete site from npub.pro database
  let domain = "";
  try {
    const u = new URL(site.origin || "");
    if (u.hostname.endsWith("." + NPUB_PRO_DOMAIN)) {
      domain = u.hostname.split("." + NPUB_PRO_DOMAIN)[0];
    }
  } catch (e) {
    console.log("Bad site url", site.url);
  }

  const reply = await fetchWithSession(
    `/delete?domain=${domain}&site=${siteId}`,
  );
  if (reply.status !== 200) throw new Error("Failed to delete domain");
  const r = await reply.json();
  console.log(Date.now(), "deleted domain", r);

  // delete from local cache
  sites.splice(index, 1);
}

function convertSites(sites: Site[]): ReturnSettingsSiteDataType[] {
  return sites.map((s) => ({
    id: s.id,
    adminPubkey: s.admin_pubkey,
    themeId: packageThemes.get(s.extensions?.[0].event_id || "") || "",
    themeName: s.extensions?.[0].petname || "",
    contributors: s.contributor_pubkeys,
    autoSubmit: Boolean(s.include_all) || Boolean(s.include_tags?.length),
    hashtags:
      s.include_tags?.filter((t) => t.tag === "t").map((t) => "#" + t.value) ||
      [],
    kinds: s.include_kinds?.map((k) => parseInt(k)) || [1],
    hashtags_homepage:
      s.homepage_tags?.filter((t) => t.tag === "t").map((t) => "#" + t.value) ||
      [],
    kinds_homepage: s.homepage_kinds?.map((k) => parseInt(k)) || [],
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
    codeinjection_head: s.codeinjection_head || "",
    codeinjection_foot: s.codeinjection_foot || "",
    navigation: {
      primary:
        s.navigation?.map((n, i) => ({
          title: n.label,
          link: n.url,
          id: "" + i,
        })) || [],
      secondary:
        s.secondary_navigation?.map((n, i) => ({
          title: n.label,
          link: n.url,
          id: "" + i,
        })) || [],
    },
    signupStartNjump: s.config.get("nostr_login.signup_start_njump") === "true",
    postsPerPage: s.config.get("posts_per_page") || "",
    contentActionMain: s.config.get("content_cta_main") || "",
    contentActions: (s.config.get("content_cta_list") || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => !!s),
  }));
}

async function fetchSiteThemes() {
  const events = await fetchEvents(
    ndk,
    {
      // @ts-ignore
      kinds: [KIND_PACKAGE],
      ids: sites
        .map((s) => s.extensions?.[0].event_id || "")
        .filter((id) => !!id),
    },
    [SITE_RELAY],
  );

  for (const e of events) {
    const a = parseATag(tv(e, "a"));
    if (!a || !a.pubkey) continue;
    const naddr = nip19.naddrEncode(a);
    packageThemes.set(e.id, naddr);
  }
}

function parseSite(ne: NostrEvent) {
  const e = new NDKEvent(ndk, ne);
  const addr: SiteAddr = {
    identifier: tv(e, "d") || "",
    pubkey: e.pubkey,
    relays: [SITE_RELAY, ...userRelays],
  };
  return parser.parseSite(addr, e);
}

export async function getSiteSettings(siteId: string) {
  await fetchSites();
  return sites.find((s) => s.id === siteId);
}

export async function fetchSites() {
  console.log("fetchSites", userPubkey);
  if (!userPubkey) throw new Error("Auth please");

  if (sitesPromise) await sitesPromise;

  if (!sites.length) {
    sitesPromise = new Promise<void>(async (ok) => {
      const relays = [SITE_RELAY, ...userRelays];
      const events = await fetchEvents(
        ndk,
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
          // contributor
          {
            // @ts-ignore
            kinds: [KIND_SITE],
            "#p": [userPubkey],
          },
        ],
        relays,
        5000,
      );
      console.log("site events", events);

      // sort by timestamp desc
      const array = [...events.values()].sort(
        (a, b) => b.created_at! - a.created_at!,
      );

      await filterDeleted(array, relays);

      sites.push(...array.map((e) => parseSite(e.rawEvent())));

      await fetchSiteThemes();

      ok();
    });

    await sitesPromise;
    console.log("sites", sites);
  }

  return convertSites(sites);
}

export function resetSites() {
  sites.length = 0;
}

addOnAuth(async (type: string) => {
  // clear sites on logout
  if (type === "logout") sites.length = 0;
});

export async function fetchProfiles(pubkeys: string[]): Promise<NDKEvent[]> {
  return profileFetchMutex.run(async () => {
    const res: NDKEvent[] = [];
    const req: string[] = [];
    for (const p of pubkeys) {
      const c = profileCache.get(p);
      if (c === undefined) {
        req.push(p);
      } else if (c !== null) {
        res.push(c);
      }
    }

    if (!req.length) {
      return res;
    }

    const events = await fetchEvents(
      ndk,
      {
        kinds: [KIND_PROFILE],
        authors: req,
      },
      OUTBOX_RELAYS,
    );

    for (const e of events) {
      profileCache.set(e.pubkey, e);
      res.push(e);
    }

    for (const p of req) {
      if (!profileCache.get(p)) profileCache.set(p, null);
    }

    return res;
  });
}

export async function searchProfiles(text: string): Promise<NDKEvent[]> {
  let search = text + " include:spam";
  if (!text.trim().startsWith("npub1")) search += " sort:popular";
  const events = await fetchEvents(
    ndk,
    {
      kinds: [KIND_PROFILE],
      search,
      limit: 3,
    },
    SEARCH_RELAYS,
  );

  for (const e of events) {
    profileCache.set(e.pubkey, e);
  }

  return [...events];
}

export async function searchSites(
  text: string,
  until?: number,
): Promise<[ReturnSettingsSiteDataType[], number, boolean]> {
  const limitFetchSites = 50;
  const filter: any = {
    kinds: [KIND_SITE],
    limit: limitFetchSites,
  };
  if (text) filter.search = text;
  if (until) filter.until = until - 1;

  const events = await fetchEvents(ndk, filter, SEARCH_RELAYS, 5000);

  const isMore = !([...events].length < limitFetchSites);

  const array = [...events].sort((a, b) => b.created_at! - a.created_at!);

  const relays = [SITE_RELAY, ...userRelays];
  await filterDeleted(array, relays);

  const sites = array.map((e) => parseSite(e.rawEvent()));

  const pubkeys = sites.map((s) => s.admin_pubkey);
  const profiles = await fetchProfiles(pubkeys);

  const res = convertSites(sites);
  res.forEach((s) => {
    const profile = profiles.find((p) => p.pubkey === s.adminPubkey);
    const npub = nip19.npubEncode(s.adminPubkey);
    if (profile) {
      try {
        const meta = JSON.parse(profile.content);
        s.adminName =
          meta.display_name || meta.name || npub.substring(0, 10) + "...";
        s.adminAvatar = meta.picture || "";
      } catch {}
    }
  });

  return [res, array.length ? array[sites.length - 1].created_at! : 0, isMore];
}

export const fetchCertDomain = async (domain: string) => {
  const reply = await fetchWithSession(
    `/cert?domain=${domain}`,
    undefined,
    "POST",
  );
  if (reply.status === 200) return reply.json();
  else throw new Error("Failed to issue certificate");
};

export const fetchCertDomainStatus = async (domain: string) => {
  const reply = await fetchWithSession(`/cert?domain=${domain}`);
  if (reply.status === 200) return reply.json();
  else throw new Error("Failed to fetch certificate status");
};

export const fetchAttachDomain = async (domain: string, site: string) => {
  const reply = await fetchWithSession(
    `/attach?domain=${domain}&site=${site}`,
    undefined,
    "POST",
  );
  if (reply.status === 200) return reply.json();
  else throw new Error("Failed to attach domain");
};

export const fetchAttachDomainStatus = async (domain: string, site: string) => {
  const reply = await fetchWithSession(`/attach?domain=${domain}&site=${site}`);

  if (reply.status === 200) return reply.json();
  else throw new Error("Failed to fetch domain status");
};

export const fetchDomains = async (site: string) => {
  const reply = await fetchWithSession(`/attach?site=${site}`);
  return reply.json();
};

export const searchPosts = async (siteId: string, query: string) => {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return [];

  const filters = createSiteFilters({
    settings: site,
    limit: 10,
  });

  console.log("search filters", filters);

  const events = await fetchEvents(
    ndk,
    filters.map((f) => ({ ...f, search: query })),
    SEARCH_RELAYS,
  );

  console.log("searched events", events);

  const valid = [...events].filter((e) => matchPostsToFilters(e, filters));

  const posts: Post[] = [];
  for (const e of valid) {
    const post = await parser.parseEvent(e);
    if (post) posts.push(post);
  }

  return posts;
};

export const fetchPins = async (siteId: string) => {
  const site = sites.find((s) => s.id === siteId);
  if (!site) return [];

  const addr = parseAddr(siteId);

  const pinList = await fetchEvent(
    ndk,
    {
      "#d": [`${KIND_SITE}:${addr.pubkey}:${addr.identifier}`],
      kinds: [KIND_PINNED_ON_SITE as NDKKind],
      authors: [site.admin_pubkey],
    },
    [...site.admin_relays, ...SEARCH_RELAYS],
  );
  console.log("pinList", pinList);

  const idAddrs = new Set<string>();
  if (pinList) {
    const ids = parser.parsePins(pinList);
    for (const id of ids) idAddrs.add(id);
  }
  console.log("idAddrs", { idAddrs });

  const pinFilters: NDKFilter[] = [];
  const idFilter: NDKFilter = {
    ids: [...idAddrs]
      .filter((i) => i.startsWith("note"))
      .map((id) => nip19.decode(id).data) as string[],
  };

  const addrs = [...idAddrs]
    .filter((i) => i.startsWith("naddr"))
    .map((a) => nip19.decode(a).data) as nip19.AddressPointer[];

  const addrFilter: NDKFilter = {
    authors: [...new Set(addrs.map((a) => a.pubkey))],
    kinds: [...new Set(addrs.map((a) => a.kind))],
    "#d": [...new Set(addrs.map((a) => a.identifier))],
  };

  if (idFilter.ids?.length) pinFilters.push(idFilter);
  if (addrFilter.authors?.length) pinFilters.push(addrFilter);

  console.log("pinFilters", pinFilters);
  if (!pinFilters.length) return [];

  const pinned = await fetchEvents(ndk, pinFilters, [
    ...site.contributor_relays,
    ...SEARCH_RELAYS,
  ]);
  console.log("pinned", pinned);

  const submits = await fetchSubmits(site);

  const siteFilters = createSiteFilters({
    settings: site,
    limit: 10,
  });

  const valid = [...pinned].filter(
    (p) =>
      matchPostsToFilters(p, siteFilters) ||
      submits.find((s) => s.id === eventId(p)),
  );
  console.log("pinned valid", valid);
  const posts: Post[] = [];
  for (const e of valid) {
    const post = await parser.parseEvent(e);
    if (post) posts.push(post);
  }

  return posts;
};

export const savePins = async (siteId: string, ids: string[]) => {
  if (userIsDelegated) throw new Error("Can't edit pins in delegated mode");

  const site = sites.find((s) => s.id === siteId);
  if (!site) return [];

  if (site.admin_pubkey !== userPubkey)
    throw new Error("Only admin can edit pins");

  const addr = parseAddr(siteId);

  const event = {
    kind: KIND_PINNED_ON_SITE,
    content: "",
    created_at: Math.floor(Date.now() / 1000),
    tags: [["d", `${KIND_SITE}:${addr.pubkey}:${addr.identifier}`]],
    pubkey: userPubkey,
  };

  const tags = ids
    .map((id) => {
      const { type, data } = nip19.decode(id);
      switch (type) {
        case "note":
          return ["e", data];
        case "nevent":
          return ["e", data.id];
        case "naddr":
          return ["a", `${data.kind}:${data.pubkey}:${data.identifier}`];
        default:
          return undefined;
      }
    })
    .filter(Boolean) as string[][];

  event.tags.push(...tags);

  // sign it
  const nevent = new NDKEvent(ndk, event);
  await nevent.sign(new NDKNip07Signer());
  console.log("signed pins event", nevent);

  // publish
  const r = await nevent.publish(
    NDKRelaySet.fromRelayUrls([...site.admin_relays, ...SEARCH_RELAYS], ndk),
  );
  console.log(
    "published pins event to",
    [...r].map((r) => r.url),
  );
  if (!r.size) throw new Error("Failed to publish to relays");
};
