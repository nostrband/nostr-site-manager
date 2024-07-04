import NDK, { NDKEvent, NDKNip07Signer, NDKRelaySet } from "@nostr-dev-kit/ndk";
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
  fetchOutboxRelays,
  getProfileSlug,
  parseAddr,
  prepareSite,
  prepareSiteByContent,
  setHtml,
  tv,
} from "libnostrsite";
import {
  fetchWithSession,
  ndk,
  publishSite,
  srm,
  stag,
  stv,
  userIsDelegated,
  userProfile,
  userPubkey,
  userRelays,
} from "./nostr";
import { nip19 } from "nostr-tools";
import { NPUB_PRO_API, NPUB_PRO_DOMAIN, THEMES_PREVIEW } from "@/consts";
import { isEqual, omit } from "lodash";
import { SERVER_PUBKEY, SITE_RELAY } from "./consts";

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
}

let token = "";
const themes: NDKEvent[] = [];
const themePackages: NDKEvent[] = [];
const parsedThemes: Map<string, Theme> = new Map();
let settings: PreviewSettings | undefined;
let designSettings: DesignSettings | undefined;

const parser = new NostrParser();
const assetFetcher = new DefaultAssetFetcher();
const previewCache = new Map<string, string>();

// current site + renderer
let addr: SiteAddr | undefined;
let site: NDKEvent | undefined;
let store: NostrStore | undefined;
let renderer: NostrSiteRenderer | undefined;
let tags: string[] | undefined;
let publishing: "init" | "publishing" | "done" = "init";

// FIXME remove take from libnostrsite
const KIND_THEME = 30514;
const INDEX_URL = "https://cdn.npubpro.com/index.js";

// preload themes asap
const prefetchThemesPromise = (async function prefetchThemes() {
  if (!globalThis.document) return;

  const addrs = THEMES_PREVIEW.map((t) => t.id).map(
    (n) => nip19.decode(n).data as nip19.AddressPointer
  );

  const themeFilter = {
    kinds: [KIND_THEME],
    authors: [addrs[0].pubkey],
    "#d": addrs.map((a) => a.identifier),
  };

  const themeEvents = await ndk.fetchEvents(
    themeFilter,
    { groupable: false },
    NDKRelaySet.fromRelayUrls([SITE_RELAY], ndk)
  );

  themes.push(...themeEvents);
  console.log("prefetched themes", themes);

  const packageFilter = {
    kinds: [KIND_PACKAGE],
    ids: themes.map((e) => tv(e, "e")).filter((id) => !!id) as string[],
  };

  const packageEvents = await ndk.fetchEvents(
    packageFilter,
    { groupable: false },
    NDKRelaySet.fromRelayUrls([SITE_RELAY], ndk)
  );

  themePackages.push(...packageEvents);
  console.log("prefetched packages", themePackages);
})();

// https://stackoverflow.com/a/51086893
// export class Mutex {
//   private current: Promise<void> = Promise.resolve();
//   lock = (): Promise<() => void> => {
//     let _resolve: () => void;
//     const p = new Promise<void>((resolve) => {
//       _resolve = () => resolve();
//     });
//     // Caller gets a promise that resolves when the current outstanding
//     // lock resolves
//     const rv = this.current.then(() => _resolve);
//     // Don't allow the next request until the new promise is done
//     this.current = p;
//     // Return the new promise
//     return rv;
//   };

//   async run(cb: () => Promise<any>) {
//     const unlock = await this.lock();
//     try {
//       const r = await cb();
//       unlock();
//       return r;
//     } catch (e) {
//       unlock();
//       throw e;
//     }
//   }
// }

type MutexEntry = {
  cb: () => Promise<any>;
  ok: (r: any) => void;
  err: (r: any) => void;
};

export class Mutex {
  private queue: MutexEntry[] = [];
  private running = false;

  private async execute() {
    const { cb, ok, err } = this.queue.shift()!;
    this.running = true;
    try {
      ok(await cb());
    } catch (e) {
      err(e);
    }
    this.running = false;
    if (this.queue.length > 0) this.execute();
  }

  public hasPending() {
    return this.queue.length > 0;
  }

  public async run(cb: () => Promise<any>) {
    return new Promise(async (ok, err) => {
      this.queue.push({ cb, ok, err });
      if (!this.running && this.queue.length === 1) this.execute();
    });
  }
}

export async function setPreviewSettings(ns: PreviewSettings) {
  let updated = !isEqual(
    omit(settings, ["themeId", "design"]),
    omit(ns, "themeId", "design")
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
  if (newContribs) tags = undefined;

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

function setSite(s: NDKEvent) {
  if (s.pubkey !== userPubkey) throw new Error("Not your site");

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
  const events = await ndk.fetchEvents(
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
    {
      groupable: false,
    },
    NDKRelaySet.fromRelayUrls(relays, ndk)
  );

  const topTags = new Map<string, number>();
  for (const t of [...events]
    .map((e) =>
      e.tags.filter((t) => t.length >= 2 && t[0] === "t").map((t) => t[1])
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

  if (tags) return;

  tags = await fetchTopHashtags(info.contributor_pubkeys);
}

function setSiteTheme(theme: NDKEvent) {
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
  // console.log("theme", theme, "id", settings!.themeId, "themes", themes);
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

    if (userIsDelegated) event.pubkey = SERVER_PUBKEY;

    // admin not contributor?
    if (
      settings.contributors &&
      settings.contributors.length > 0 &&
      !settings.contributors.includes(userPubkey)
    ) {
      const contribSlug = tv(event, "d");
      let slug = contribSlug + "-1";
      if (userProfile) {
        const adminSlug = getProfileSlug(userProfile);
        if (adminSlug) slug = contribSlug + "-" + adminSlug;
      }

      // update the slug
      stv(event, "d", slug);
      console.log("site slug", slug);
    }

    // make sure d-tag is unique, use ':' as
    // suffix separator so that we could parse it and extract
    // the original d-tag to use as preferred domain name
    const d_tag = tv(event, "d");
    stv(
      event,
      "d",
      // https://stackoverflow.com/a/8084248
      d_tag + ":" + (Math.random() + 1).toString(36).substring(2, 5)
    );

    // reset renderer, init store, etc
    setSite(new NDKEvent(ndk, event));
    if (!site) throw new Error("No site");

    // set current theme
    setSiteTheme(pkg);

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

    if (userIsDelegated) {
      if (site.pubkey !== SERVER_PUBKEY || tv(site, "u") !== userPubkey)
        throw new Error("Not your site");
    } else {
      if (site.pubkey !== userPubkey) throw new Error("Not your site");
    }

    // theme
    setSiteTheme(pkg);

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

    console.log("updated site event", site);
  }

  // save local copy
  await storePreview();
}

// export async function preparePreview() {
//   // make sure themes are ready
//   await prefetchThemesPromise;

//   // mutex
//   if (preparePromise) await preparePromise;

//   // prepare
//   console.log("prepareState", prepareState);
//   if (prepareState === "stale") {
//     preparePromise = prepareUpdateSite().then(() => {
//       prepareState = "ready";
//       console.log("prepareState", prepareState);
//     });
//   }

//   return preparePromise;
// }

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
  path: string = "/"
) {
  if (!iframe) throw new Error("No iframe");
  const html = await renderPreviewHtml(path);

  return new Promise<void>((ok) => {
    iframe.src = "/preview.html?" + Math.random();
    iframe.onload = async () => {
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
  setSiteTheme(pkg);

  const event = await publishSite(site, [SITE_RELAY, ...userRelays]);

  // // sign it
  // await site.sign(new NDKNip07Signer());
  // console.log("signed site event", site);

  // // publish
  // const r = await site.publish(
  //   NDKRelaySet.fromRelayUrls([SITE_RELAY, ...userRelays], ndk),
  // );
  // console.log(
  //   "published site event to",
  //   [...r].map((r) => r.url),
  // );

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
  const event = await ndk.fetchEvent(
    {
      // @ts-ignore
      kinds: [KIND_SITE],
      authors: [addr.pubkey],
      "#d": [addr.identifier],
    },
    { groupable: false },
    NDKRelaySet.fromRelayUrls([SITE_RELAY, ...addr.relays], ndk)
  );
  console.log("loaded site event", siteId, event);

  // discard draft if fetched is newer
  if (event && (!fetchedSite || fetchedSite.created_at! < event.created_at!)) {
    fetchedSite = event;
    console.log("loaded site is newer than draft");
  }

  if (!fetchedSite) throw new Error("No site");
  setSite(fetchedSite);
}

export async function updatePreviewSite(ds: DesignSettings) {
  if (!site) throw new Error("No site");
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
        const requestedDomain = tv(site, "d")!.split(":")[0];
        console.log("naddr", naddr);
        console.log("requesting domain", requestedDomain);
        const reply = await fetchWithSession(
          `${NPUB_PRO_API}/reserve?domain=${requestedDomain}&site=${naddr}`
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
            `${NPUB_PRO_API}/deploy?domain=${u.hostname}&site=${naddr}`
          );
          if (reply.status !== 200) throw new Error("Failed to deploy");

          const r = await reply.json();
          console.log(Date.now(), "deployed", r);
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
  if (!tags) throw new Error("No site");
  return tags.map((t) => "#" + t);
}

export function getPreviewSiteId() {
  if (!site) throw new Error("No site");
  return eventId(site);
}

export function getPreviewSiteInfo() {
  if (!addr || !site) throw new Error("No site");
  return parser.parseSite(addr, site);
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
  const reply = await fetchWithSession(
    `${NPUB_PRO_API}/check?domain=${domain}&site=${naddr}`
  );
  return reply.status === 200;
}
