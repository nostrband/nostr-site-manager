import { NDKEvent, NostrEvent } from "@nostr-dev-kit/ndk";
import {
  DefaultAssetFetcher,
  KIND_PACKAGE,
  KIND_SITE,
  NostrParser,
  NostrSiteRenderer,
  NostrStore,
  Site,
  SiteAddr,
  Theme,
  eventId,
  fetchEvent,
  fetchEvents,
  fetchOutboxRelays,
  getProfileSlug,
  parseAddr,
  prepareSite,
  prepareSiteByContent,
  setHtml,
  tags,
  tv,
  parseATag,
} from "libnostrsite";
import {
  fetchWithSession,
  ndk,
  publishSiteEvent,
  srm,
  stag,
  stv,
  userIsDelegated,
  userProfile,
  userPubkey,
  userRelays,
} from "./nostr";
import { nip19 } from "nostr-tools";
import { NPUB_PRO_DOMAIN, THEMES_PREVIEW } from "@/consts";
import { isEqual, omit } from "lodash";
import { SERVER_PUBKEY, SITE_RELAY } from "./consts";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { CustomConfigType } from "@/components/Pages/Design/types";
import { resetSites } from "./api";

export interface PreviewSettings {
  themeId: string;
  siteId?: string;
  domain?: string;
  contributors?: string[];
  kinds?: number[];
  hashtags?: string[];
  design?: boolean;
}

export interface DesignSettings {
  name: string;
  title: string;
  description: string;
  accent_color: string;
  cover_image: string;
  icon: string;
  logo: string;
  navigation: { label: string; url: string }[];
  custom: { [key: string]: string };
}

const serverPubkey = SERVER_PUBKEY;
if (!serverPubkey) throw new Error("No server pubkey");

const themes: NDKEvent[] = [];
const themePackages: NDKEvent[] = [];
const parsedThemes: Map<string, Theme> = new Map();
let settings: PreviewSettings | undefined;
let designSettings: DesignSettings | undefined;

const parser = new NostrParser();
const assetFetcher = new DefaultAssetFetcher();
const previewCache = new Map<string, string>();
const customSettingsCache = new Map<string, CustomConfigType>();

// current site + renderer
let addr: SiteAddr | undefined;
let site: NDKEvent | undefined;
let store: NostrStore | undefined;
let renderer: NostrSiteRenderer | undefined;
let hashtags: string[] | undefined;
let publishing: "init" | "publishing" | "done" = "init";

// FIXME remove take from libnostrsite
const KIND_THEME = 30514;
const INDEX_URL = "https://cdn.npubpro.com/index.js";

// preload themes asap
const prefetchThemesPromise = (async function prefetchThemes() {
  if (!globalThis.document) return;

  const addrs = THEMES_PREVIEW.map((t) => t.id).map(
    (n) => nip19.decode(n).data as nip19.AddressPointer,
  );

  const themeFilter = {
    kinds: [KIND_THEME],
    // FIXME so we assume all themes are authored by me?
    authors: [addrs[0].pubkey],
    "#d": addrs.map((a) => a.identifier),
  };

  const themeEvents = await fetchEvents(ndk, themeFilter, [SITE_RELAY], 10000);
  themes.push(...themeEvents);
  console.log("prefetched themes", themes);

  const packages = await fetchPackages(themes);
  themePackages.push(...packages);
  console.log("prefetched packages", themePackages);
})();

async function ensureSiteTheme(site: NDKEvent) {
  // theme package event id
  const eid = tv(site, "x") || "";
  if (!eid) throw new Error("No theme in site");

  // package already cached?
  if (themePackages.find((p) => p.id === eid)) return;

  console.log("ensuring site theme, package", eid);

  const pkg = await fetchEvent(
    ndk,
    {
      // @ts-ignore
      kinds: [KIND_PACKAGE],
      ids: [eid],
    },
    [SITE_RELAY],
    2000,
  );
  if (!pkg) throw new Error("Theme package not found");

  console.log("fetched site theme package", pkg);
  themePackages.push(pkg);

  const themeAddr = parseATag(tv(pkg, "a"));
  if (!themeAddr || !themeAddr.pubkey || themeAddr.kind !== KIND_THEME)
    throw new Error("Bad theme addr");

  // theme already cached?
  if (
    themes.find(
      (t) =>
        t.pubkey === themeAddr.pubkey && tv(t, "d") === themeAddr.identifier,
    )
  )
    return;

  console.log("ensuring site theme", themeAddr);

  const theme = await fetchEvent(
    ndk,
    {
      // @ts-ignore
      kinds: [KIND_THEME],
      authors: [themeAddr.pubkey],
      "#d": [themeAddr.identifier],
    },
    [SITE_RELAY],
    2000,
  );
  if (!theme) throw new Error("Theme not found");

  console.log("fetched site theme", theme);
  themes.push(theme);
}

async function fetchPackages(themes: NDKEvent[] | NostrEvent[]) {
  const packageFilter = {
    kinds: [KIND_PACKAGE],
    ids: themes.map((e) => tv(e, "e")).filter((id) => !!id) as string[],
  };

  return await fetchEvents(ndk, packageFilter, [SITE_RELAY], 10000);
}

export async function setPreviewSettings(ns: PreviewSettings) {
  await prefetchThemesPromise;

  let updated = !isEqual(
    omit(settings, ["themeId", "design"]),
    omit(ns, "themeId", "design"),
  );

  let newContribs = !site;
  if (updated && site) {
    const info = getPreviewSiteInfo();
    const hashtags = getPreviewHashtags();
    const kinds = getPreviewKinds();
    const newContributors = ns.contributors || info.contributor_pubkeys;
    const newHashtags = ns.hashtags || hashtags;
    const newKinds = ns.kinds || kinds;
    newContribs = !isEqual(newContributors, info.contributor_pubkeys);
    // console.log(
    //   "set settings compare",
    //   newContribs,
    //   {
    //     contr: newContributors,
    //     hashtags: newHashtags,
    //     kinds: newKinds,
    //     siteId: ns.siteId,
    //   },
    //   {
    //     contr: info.contributor_pubkeys,
    //     hashtags,
    //     kinds,
    //     siteId: eventId(site),
    //   }
    // );
    if (
      isEqual(newContributors, info.contributor_pubkeys) &&
      isEqual(newHashtags, hashtags) &&
      isEqual(newKinds, kinds) &&
      // same site or unpublished site
      (ns.siteId === eventId(site) || !site.id)
    ) {
      updated = false;
    }
  }

  const newTheme = ns.themeId !== settings?.themeId;

  // make sure all is up to date, including new theme
  settings = ns;

  // reset tags store if needed before preparing the site
  if (newContribs) hashtags = undefined;

  if (updated) {
    console.log("updated settings", settings);

    // make sure themes are ready
    await prefetchThemesPromise;

    // load existing site if specified
    if (settings.siteId) await fetchSite();

    // set the provided settings to the site object
    await preparePreviewSite();

    // reset cache
    previewCache.clear();
  }

  // need rerender?
  return updated || newTheme;
}

function checkYourSite(s: NDKEvent | NostrEvent) {
  if (userIsDelegated) {
    if (s.pubkey === userPubkey)
      throw new Error("Cannot edit your site in delegated mode");
    if (s.pubkey !== serverPubkey || tv(s, "u") !== userPubkey)
      throw new Error("Not your site");
  } else {
    if (s.pubkey !== serverPubkey) {
      if (s.pubkey !== userPubkey) throw new Error("Not your site");
    } else {
      if (tv(s, "u") !== userPubkey) throw new Error("Not your site");
    }
  }
}

function setSite(s: NDKEvent) {
  checkYourSite(s);

  site = s;

  // reset it
  renderer = undefined;

  // site name
  const identifier = tv(site, "d") || "";
  addr = {
    identifier,
    pubkey: site.pubkey,
    relays: [],
  };
}

export async function fetchTopHashtags(pubkeys: string[]) {
  const relays =
    pubkeys.length === 1 && pubkeys[0] === userPubkey
      ? userRelays.slice(0, 3)
      : await fetchOutboxRelays(ndk, pubkeys);

  console.log("loading tags");
  const events = await fetchEvents(
    ndk,
    [
      {
        authors: pubkeys,
        kinds: [1],
        limit: 50,
      },
      {
        authors: pubkeys,
        kinds: [30023],
        limit: 50,
      },
    ],
    relays,
    1000,
  );

  const topTags = new Map<string, number>();
  for (const t of [...events]
    .map((e) =>
      e.tags.filter((t) => t.length >= 2 && t[0] === "t").map((t) => t[1]),
    )
    .flat()) {
    let c = topTags.get(t) || 0;
    c++;
    topTags.set(t, c);
  }
  const tags = [...topTags.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((t) => t[0]);
  console.log("loaded tags", tags);
  return tags;
}

async function loadSite() {
  // to figure out the hashtags and navigation we have to load the
  // site posts first, this is kinda ugly and slow but easier to reuse
  // the fetching logic this way
  const info = getPreviewSiteInfo();
  store = new NostrStore("preview", ndk, info, parser);
  await store.load(50);

  if (hashtags) return;

  hashtags = await fetchTopHashtags(info.contributor_pubkeys);
}

function setSiteThemePackage(theme: NDKEvent) {
  if (!site || !theme) throw new Error("Bad params");
  const title = tv(theme, "title") || "";
  const version = tv(theme, "version") || "";
  const name = title + (version ? " v." + version : "");

  srm(site, "x");
  stag(site, [
    "x",
    theme.id,
    SITE_RELAY,
    tv(theme, "x") || "", // package hash
    name,
  ]);
}

function getThemePackage(id = "") {
  id = id || settings!.themeId;

  const theme = themes.find((t) => eventId(t) === id);
  console.log("theme", { theme, id, themes, settings });
  if (!theme) throw new Error("No theme");

  const pkg = themePackages.find((p) => p.id === tv(theme, "e"));
  if (!pkg) throw new Error("No theme package");

  return pkg;
}

async function preparePreviewSite() {
  if (!settings) throw new Error("No settings");
  if (!settings.themeId) throw new Error("No theme id");

  const pkg = getThemePackage();

  // cut '#'
  const hashtags = settings.hashtags
    ? settings.hashtags.map((h) => h.slice(1))
    : undefined;

  // new site?
  if (!site || !settings.siteId) {
    //|| (!site.id && !settings.design)) {
    // start from zero, prepare site event from input settings,
    // fill everything with defaults
    const event = await prepareSite(ndk, userPubkey, {
      contributorPubkeys: settings.contributors,
      kinds: settings.kinds,
      hashtags,
    });

    // admin not contributor?
    let slug = tv(event, "d") || "";
    if (
      settings.contributors &&
      settings.contributors.length > 0 &&
      !settings.contributors.includes(userPubkey)
    ) {
      const contribSlug = slug;
      slug = contribSlug + "-" + userPubkey.substring(0, 4);
      if (userProfile) {
        const adminSlug = getProfileSlug(userProfile);
        if (adminSlug) slug = contribSlug + "-" + adminSlug;
      }
    }

    // empty or small usernames
    if (slug.length < 2) {
      slug = "user-" + userPubkey.substring(0, 4);
    }

    // update the slug
    stv(event, "d", slug);
    console.log("site slug", slug);

    // make sure d-tag is unique, use ':' as
    // suffix separator so that we could parse it and extract
    // the original d-tag to use as preferred domain name,
    // use longer random suffix for delegated sites
    const d_tag = tv(event, "d");
    stv(
      event,
      "d",
      d_tag + ":" + bytesToHex(randomBytes(userIsDelegated ? 8 : 3)),
    );

    if (userIsDelegated) {
      // set admin as owner, server as event author
      stv(event, "u", userPubkey);
      event.pubkey = serverPubkey!;
    }

    // reset renderer, init store, etc
    setSite(new NDKEvent(ndk, event));
    if (!site) throw new Error("No site");

    // set current theme
    setSiteThemePackage(pkg);

    // load posts to init from content
    await loadSite();

    // fake origin for now
    //    stv(site!, "r", document.location.origin);
    // fill in hashtags etc
    await prepareSiteByContent(site!, store!);

    // now we're ready
    console.log("prepared site event", site);
  } else {
    // for existing sites that have already been published
    // we only update the input settings

    // ensure we actually can edit this site
    checkYourSite(site);

    // theme
    setSiteThemePackage(pkg);

    // admin doesn't change

    // p-tags
    if (settings.contributors) {
      srm(site, "p");
      for (const p of settings.contributors) site.tags.push(["p", p]);
    }

    // kinds
    if (settings.kinds) {
      srm(site, "kind");
      for (const k of settings.kinds) site.tags.push(["kind", k + ""]);
    }

    // hashtags
    if (hashtags) {
      srm(site, "include");
      for (const t of hashtags) site.tags.push(["include", "t", t]);
      if (!hashtags.length) stv(site, "include", "*");
    }

    // set it
    setSite(site);

    // load posts
    await loadSite();

    console.log("updated site event", site, hashtags);
  }

  // save local copy
  await storePreview();
}

async function getParsedTheme(id = "") {
  id = id || settings!.themeId;

  const c = parsedThemes.get(id);
  if (c) return c;

  const pkg = getThemePackage(id);
  const p = await parser.parseTheme(pkg);
  parsedThemes.set(id, p);
  return p;
}

async function renderPreviewHtml(path: string = "/") {
  console.log(Date.now(), "render preview", path);
  if (!addr || !site || !store || !settings) throw new Error("No site");

  if (path === "/") {
    const result = previewCache.get(settings.themeId);
    if (result) return result;
  }

  const parsedTheme = await getParsedTheme();
  console.log("parsedTheme", parsedTheme);

  if (!renderer) {
    try {
      const r = new NostrSiteRenderer({ assetFetcher });
      await r.start({
        addr,
        mode: "preview",
        ssrIndexScriptUrl: INDEX_URL,
        noDefaultPlugins: true,
        store,
        site,
        theme: parsedTheme,
      });
      renderer = r;
    } catch (e) {
      console.log("failed to init renderer", e);
      throw new Error("Failed to init renderer");
    }
  } else {
    await renderer.switchTheme(parsedTheme);
    console.log(Date.now(), "switched theme");
  }

  const { result } = await renderer.render(path);
  if (path === "/") previewCache.set(settings.themeId, result);
  return result;
}

export async function renderPreview(
  iframe: HTMLIFrameElement,
  path: string = "/",
) {
  if (!iframe) throw new Error("No iframe");
  const html = await renderPreviewHtml(path);

  return new Promise<void>((ok) => {
    iframe.src = "/preview.html?" + Math.random();
    iframe.onload = async () => {
      iframe.onload = null;

      const cw = iframe.contentWindow!;
      await setHtml(html, cw.document, cw);

      // resolve
      ok();

      // set link handlers to simulate navigation
      const links = cw.document.querySelectorAll("a");
      // console.log("links", links);
      for (const l of links) {
        if (!l.href) continue;
        try {
          const url = new URL(l.href, document.location.href);
          if (
            url.origin === document.location.origin ||
            url.origin === "http://localhost"
          ) {
            l.addEventListener("click", async (e: Event) => {
              e.preventDefault();
              console.log("clicked", e.target, url.pathname);
              renderPreview(iframe, url.pathname);
            });
          }
        } catch {}
      }
    };
  });
}

async function storePreview() {
  if (!site) throw new Error("No site");

  // update timestamp to make sure this draft is 'newer'
  // than existing site on relays
  site.created_at = Math.floor(Date.now() / 1000);

  window.localStorage.setItem(eventId(site), JSON.stringify(site.rawEvent()));

  console.log("stored preview");

  return eventId(site);
}

async function publishPreview() {
  if (!site || !settings) throw new Error("No site");

  // set the chosen theme
  const pkg = getThemePackage();
  setSiteThemePackage(pkg);

  const event = await publishSiteEvent(site, [SITE_RELAY, ...userRelays]);

  // return naddr
  return eventId(event);
}

async function fetchSite() {
  if (!settings || !settings.siteId) throw new Error("No site id");
  const siteId = settings.siteId;

  // already loaded?
  if (site && eventId(site) === siteId) return;

  // get local draft
  const localSite = window.localStorage.getItem(siteId);
  let fetchedSite = null;
  if (localSite) {
    try {
      console.log("localSite", localSite);
      fetchedSite = new NDKEvent(ndk, JSON.parse(localSite));
    } catch {
      console.warn("Bad site in local store", siteId);
    }
  }

  // fetch remote event
  const addr = parseAddr(siteId);
  console.log("loading site addr", addr);
  const event = await fetchEvent(
    ndk,
    {
      // @ts-ignore
      kinds: [KIND_SITE],
      authors: [addr.pubkey],
      "#d": [addr.identifier],
    },
    [SITE_RELAY, ...addr.relays],
  );
  console.log("loaded site event", siteId, event);

  // discard draft if fetched is newer
  if (event && (!fetchedSite || fetchedSite.created_at! < event.created_at!)) {
    fetchedSite = event;
    console.log("loaded site is newer than draft");
  }

  if (!fetchedSite) throw new Error("No site");

  // make sure we have theme and package loaded for this site
  await ensureSiteTheme(fetchedSite);

  setSite(fetchedSite);
}

export async function updatePreviewSite(ds: DesignSettings) {
  if (!site) throw new Error("No site");
  console.log("designSettings", ds, designSettings);
  if (isEqual(ds, designSettings)) return false;

  designSettings = ds;
  const e = site.rawEvent();
  stv(e, "name", ds.name);
  stv(e, "title", ds.title);
  stv(e, "summary", ds.description);
  stv(e, "logo", ds.logo);
  stv(e, "icon", ds.icon);
  stv(e, "image", ds.cover_image);
  stv(e, "color", ds.accent_color);

  srm(e, "nav");
  for (const n of ds.navigation) e.tags.push(["nav", n.url, n.label]);

  // DEPRECATED
  srm(e, "custom");

  // new way to store settings
  srm(e, "settings", "theme");
  for (const key in ds.custom)
    e.tags.push(["settings", "theme", key, "" + ds.custom[key]]);

  // update
  site.tags = e.tags;

  // reset renderer
  renderer = undefined;

  // reset cache
  previewCache.clear();

  // put to local store
  await storePreview();

  return true;
}

export async function publishPreviewSite() {
  if (!site || !addr) throw new Error("No site");

  if (publishing !== "publishing") return;

  try {
    await (async () => {
      const naddr = nip19.naddrEncode({
        identifier: addr.identifier,
        kind: KIND_SITE,
        pubkey: addr.pubkey,
        relays: [SITE_RELAY, ...userRelays],
      });
      console.log("publishing", naddr, site);

      // need to assign a domain?
      if (!tv(site, "r")) {
        const requestedDomain = tv(site, "d")!.split(":")[0].replace("_", "-");
        console.log("naddr", naddr);
        console.log("requesting domain", requestedDomain);
        const reply = await fetchWithSession(
          `/reserve?domain=${requestedDomain}&site=${naddr}`,
        );
        if (reply.status !== 200)
          throw new Error("Failed to reserve domain name");
        const reserve = await reply.json();
        console.log(Date.now(), "got domain", reserve);

        const subdomain = reserve.domain.split("." + NPUB_PRO_DOMAIN)[0];
        console.log("received domain", subdomain);
        const origin = `https://${reserve.domain}/`;
        srm(site, "r");
        stv(site, "r", origin);
      }

      // sign and publish the site event
      await publishPreview();

      // erase from local cache
      window.localStorage.removeItem(eventId(site));

      // deploy?
      const url = getPreviewSiteUrl();
      if (!url) return;

      try {
        const u = new URL(url);
        if (u.hostname.endsWith("." + NPUB_PRO_DOMAIN)) {
          const reply = await fetchWithSession(
            `/deploy?domain=${u.hostname}&site=${naddr}`,
          );
          if (reply.status !== 200) throw new Error("Failed to deploy");

          const r = await reply.json();
          console.log(Date.now(), "deployed", r);

          // make sure /admin updates their list of sites
          resetSites();
        }
      } catch (e) {
        console.warn("Bad site url", url, e);
      }
    })();
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    publishing = "done";
  }
}

export function getPreviewSiteUrl() {
  return tv(site!, "r") || "";
}

export async function getPreviewTopHashtags() {
  if (!hashtags) throw new Error("No site");
  return hashtags.map((t) => "#" + t);
}

export function getPreviewSiteId() {
  if (!site) throw new Error("No site");
  return eventId(site);
}

export function getPreviewSiteInfo() {
  if (!addr || !site) throw new Error("No site");
  return parser.parseSite(addr, site);
}

export async function getPreviewSiteThemeCustomSettings() {
  const r: CustomConfigType = {};
  if (!settings || !settings.themeId) return r;

  const pkg = getThemePackage();
  const cached = customSettingsCache.get(pkg.id);
  if (cached) return cached;

  const packageJsonTag = tags(pkg, "f").find(
    (t) => t.length >= 4 && t[2] === "package.json",
  );
  if (!packageJsonTag || !packageJsonTag[3]) {
    console.warn("no package json in theme package", pkg);
    return r;
  }

  const url = packageJsonTag[3];
  try {
    const d = await fetch(url);
    const json = await d.json();
    for (const name in json.config.custom) {
      r[name] = json.config.custom[name];
    }
    console.log("theme custom settings declaration", r, "package.json", json);
    customSettingsCache.set(pkg.id, r);
  } catch (e) {
    console.warn("failed to load package.json", url, e);
  }
  return r;
}

function getPreviewHashtagNames(info: Site) {
  if (!info.include_tags) return [];
  return info.include_tags.filter((t) => t.tag === "t").map((t) => t.value);
}

export function getPreviewHashtags() {
  const info = getPreviewSiteInfo();
  return getPreviewHashtagNames(info).map((t) => "#" + t);
}

export function getPreviewKinds() {
  const info = getPreviewSiteInfo();
  if (!info.include_kinds || !info.include_kinds.length) return [1, 30023];
  return info.include_kinds.map((k) => parseInt(k));
}

export function getPreviewThemeName() {
  if (!settings || !settings.themeId) return "";
  try {
    const pkg = getThemePackage();
    return tv(pkg, "title") + " v." + tv(pkg, "version");
  } catch {
    return "";
  }
}

export function getPreviewPublishingState() {
  return publishing;
}

export function startPreviewPublish() {
  publishing = "publishing";
}

export async function prefetchThemes(ids: string[]) {
  await prefetchThemesPromise;
  for (const id of ids) {
    const theme = await getParsedTheme(id);
    assetFetcher.addTheme(theme);
  }
  assetFetcher.load();
}

export async function checkNpubProDomain(domain: string, naddr: string) {
  const reply = await fetchWithSession(`/check?domain=${domain}&site=${naddr}`);
  switch (reply.status) {
    case 200:
      return "ok";
    case 409:
      return "conflict";
    default:
      return "error";
  }
}
