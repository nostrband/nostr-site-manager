import NDK, { NDKEvent, NDKNip07Signer, NDKRelaySet } from "@nostr-dev-kit/ndk";
import {
  DefaultAssetFetcher,
  KIND_PACKAGE,
  KIND_SITE,
  NostrParser,
  NostrSiteRenderer,
  NostrStore,
  SiteAddr,
  getTopHashtags,
  parseAddr,
  prepareSite,
  prepareSiteByContent,
  setHtml,
  tv,
} from "libnostrsite";
import {
  SITE_RELAY,
  eventId,
  ndk,
  srm,
  stag,
  stv,
  userPubkey,
  userRelays,
} from "./nostr";
import { nip19 } from "nostr-tools";
import { NPUB_PRO_API, NPUB_PRO_DOMAIN, THEMES_PREVIEW } from "@/consts";
import { MIN_POW, minePow } from "./pow";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils";
import { isEqual } from "lodash";

export interface PreviewSettings {
  domain?: string;
  admin: string;
  contributors: string[];
  kinds: number[];
  hashtags: string[];
}

export interface UpdateSiteInfo {
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
let settings: PreviewSettings | undefined;
let themeId: string = "";

const parser = new NostrParser();
const assetFetcher = new DefaultAssetFetcher();

// current site + renderer
let addr: SiteAddr | undefined;
let site: NDKEvent | undefined;
let store: NostrStore | undefined;
let renderer: NostrSiteRenderer | undefined;

let preparePromise: any = undefined;
let prepareState: "empty" | "stale" | "ready" = "empty";

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
    authors: [addrs[0].pubkey],
    "#d": addrs.map((a) => a.identifier),
  };

  const themeEvents = await ndk.fetchEvents(
    themeFilter,
    { groupable: false },
    NDKRelaySet.fromRelayUrls([SITE_RELAY], ndk),
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
    NDKRelaySet.fromRelayUrls([SITE_RELAY], ndk),
  );

  themePackages.push(...packageEvents);
  console.log("prefetched packages", themePackages);
})();

export function setPreviewSettings(newSettings: PreviewSettings) {
  if (!isEqual(settings, newSettings)) prepareState = "stale";
  settings = newSettings;
  console.log("set settings", settings);
}

export function setPreviewTheme(id: string) {
  themeId = id;
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
        token = data.token;
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

async function fetchWithSession(url: string) {
  try {
    const fetchIt = async () => {
      return await fetch(url, {
        headers: {
          "X-NpubPro-Token": token,
        },
      });
    };

    const r = await fetchIt();

    if (r.status === 200) return r;
    if (r.status === 401) {
      // ensure we're authed
      await getSessionToken();
      // retry
      return fetchIt();
    } else {
      return r;
    }
  } catch (e) {
    console.log("fetch error", e);
    throw e;
  }
}

async function setSite(s: NDKEvent) {
  site = s;

  // reset it
  renderer = undefined;

  // site name
  const identifier = tv(site, "d") || "";
  addr = {
    name: identifier,
    pubkey: site.pubkey,
    relays: [],
  };

  // to figure out the hashtags and navigation we have to load the
  // site posts first, this is kinda ugly and slow but easier to reuse
  // the fetching logic this way
  const info = await parser.parseSite(addr, site);
  store = new NostrStore("preview", ndk, info, parser);
  await store.load(50);
}

function setSiteTheme(theme: NDKEvent) {
  if (!site || !theme) throw new Error("Bad params");
  srm(site, "x");
  stag(site, [
    "x",
    theme.id,
    SITE_RELAY,
    tv(theme, "x") || "",
    tv(theme, "title") || "",
  ]);
}

async function prepareUpdateSite() {
  if (!settings) throw new Error("No settings");
  if (!themeId) throw new Error("No theme id");

  const theme = themes.find((t) => eventId(t) === themeId);
  if (!theme) throw new Error("No theme");

  // new site?
  if (!site || !site.id) {
    // start from zero, prepare site event from input settings,
    // fill everything with defaults
    const event = await prepareSite(ndk, settings.admin, {
      contributorPubkeys: settings.contributors,
      kinds: settings.kinds,
      hashtags: settings.hashtags,
      theme: {
        id: theme.id,
        hash: tv(theme, "x") || "",
        relay: SITE_RELAY,
        name: tv(theme, "title") || "",
      },
    });

    // fake origin for now
    stv(event, "r", document.location.origin);

    // reset renderer, init store, etc
    await setSite(new NDKEvent(ndk, event));

    // fill in hashtags etc
    await prepareSiteByContent(site!, store!);

    // now we're ready
    console.log("prepared site event", site);
  } else {
    // for existing sites that have already been published
    // we only update the input settings

    if (site.pubkey !== userPubkey) throw new Error("Not your site");

    // theme
    setSiteTheme(theme);

    // admin doesn't change

    // p-tags
    srm(site, "p");
    for (const p of settings.contributors) site.tags.push(["p", p]);

    // kinds
    srm(site, "kind");
    for (const k of settings.kinds) site.tags.push(["kind", k + ""]);

    // hashtags
    srm(site, "include");
    for (const t of settings.hashtags) site.tags.push(["include", "t", t]);
    if (!settings.hashtags.length) stv(site, "include", "*");

    console.log("updated site event", site);
  }
}

async function preparePreview() {
  // make sure themes are ready
  await prefetchThemesPromise;

  // mutex
  if (preparePromise) await preparePromise;

  // prepare
  console.log("prepareState", prepareState);
  if (prepareState === "stale") {
    preparePromise = prepareUpdateSite().then(() => {
      prepareState = "ready";
      console.log("prepareState", prepareState);
    });
  }

  return preparePromise;
}

async function renderPreviewHtml(path: string = "/") {
  console.log("render", path);
  if (!addr || !site || !store) throw new Error("No site");

  const theme = themes.find((t) => eventId(t) === themeId);
  console.log("theme", theme, "id", themeId, "themes", themes);
  if (!theme) throw new Error("No theme");

  const pkg = themePackages.find((p) => p.id === tv(theme, "e"));
  if (!pkg) throw new Error("No theme package");

  const parsedTheme = await parser.parseTheme(pkg);
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
  return result;
}

async function renderPath(iframe: HTMLIFrameElement, path: string) {
  if (!iframe) throw new Error("No iframe");
  const html = await renderPreviewHtml(path);
  iframe.src = "/preview.html?" + Math.random();
  iframe.onload = async () => {
    const cw = iframe.contentWindow!;
    await setHtml(html, cw.document, cw);

    // // @ts-ignore
    // frame.style.opacity = "1";

    const links = cw.document.querySelectorAll("a");
    console.log("links", links);
    for (const l of links) {
      if (!l.href) continue;
      try {
        const url = new URL(l.href, document.location.href);
        if (url.origin === document.location.origin) {
          l.addEventListener("click", async (e: Event) => {
            e.preventDefault();
            console.log("clicked", e.target, url.pathname);
            renderPath(iframe, url.pathname);
          });
        }
      } catch {}
    }
  };
}

export async function renderPreview(iframe: HTMLIFrameElement) {
  await preparePreview();
  await renderPath(iframe, "/");
}

export async function storePreview() {
  if (!site) throw new Error("No site");
  window.localStorage.setItem(eventId(site), JSON.stringify(site.rawEvent()));
  return eventId(site);
}

async function publishPreview() {
  if (!site) throw new Error("No site");

  // set the chosen theme
  const theme = themes.find((t) => eventId(t) === themeId);
  console.log("theme", theme, "id", themeId, "themes", themes);
  if (!theme) throw new Error("No theme");

  const pkg = themePackages.find((p) => p.id === tv(theme, "e"));
  if (!pkg) throw new Error("No theme package");

  setSiteTheme(pkg);

  // sign it
  await site.sign(new NDKNip07Signer());

  // publish
  await site.publish(
    NDKRelaySet.fromRelayUrls([SITE_RELAY, ...userRelays], ndk),
  );

  // return naddr
  return eventId(site);
}

export async function loadPreviewSite(siteId: string) {
  if (!site || eventId(site) !== siteId) {
    const localSite = window.localStorage.getItem(siteId);
    if (localSite) {
      try {
        console.log("localSite", localSite);
        await setSite(new NDKEvent(ndk, JSON.parse(localSite)));
      } catch {
        console.warn("Bad site in local store", siteId);
      }
    }

    if (!site) {
      const addr = parseAddr(siteId);
      console.log("loading site addr", addr);
      const event = await ndk.fetchEvent(
        {
          // @ts-ignore
          kinds: [KIND_SITE],
          authors: [addr.pubkey],
          "#d": [addr.name],
        },
        { groupable: false },
        NDKRelaySet.fromRelayUrls([SITE_RELAY, ...addr.relays], ndk),
      );
      console.log("loaded site event", siteId, event);
      if (!event) throw new Error("No site");

      await setSite(event);
    }
  }

  return parser.parseSite(addr!, site!);
}

export function updateSite(info: UpdateSiteInfo) {
  if (!site) throw new Error("No site");

  const e = site.rawEvent();
  // FIXME wtf??? change d tag creates a new event!
  stv(e, "title", info.title);
  stv(e, "summary", info.description);
  stv(e, "logo", info.logo);
  stv(e, "icon", info.icon);
  stv(e, "image", info.cover_image);
  stv(e, "color", info.accent_color);

  srm(e, "nav");
  for (const n of info.navigation) e.tags.push(["nav", n.url, n.label]);

  // update
  site.tags = e.tags;
  // reset
  site.created_at = 0;

  // reset renderer
  renderer = undefined;
}

export async function publishSite() {
  if (!site || !addr) throw new Error("No site");

  const naddr = nip19.naddrEncode({
    identifier: addr.name,
    kind: KIND_SITE,
    pubkey: addr.pubkey,
    relays: [SITE_RELAY, ...userRelays],
  });

  // need to assign a domain?
  if (!tv(site, "r")) {
    const requestedDomain = addr.name;
    console.log("naddr", naddr);
    console.log("requesting domain", requestedDomain);
    const reserve = await fetchWithSession(
      `${NPUB_PRO_API}/reserve?domain=${requestedDomain}&site=${naddr}`,
    ).then((r) => r.json());
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
        `${NPUB_PRO_API}/deploy?domain=${u.hostname}&site=${naddr}`,
      ).then((r) => r.json());
      console.log(Date.now(), "deployed", reply);
    }
  } catch (e) {
    console.warn("Bad site url", url, e);
  }
}

export function getPreviewSiteUrl() {
  return tv(site!, "r") || "";
}

export async function getSiteHashtags() {
  if (!store) throw new Error("No site");
  return getTopHashtags(store);
}
