import NDK, { NDKEvent, NDKNip07Signer, NDKRelaySet } from "@nostr-dev-kit/ndk";
import {
  KIND_PACKAGE,
  KIND_SITE,
  NostrParser,
  NostrSiteRenderer,
  NostrStore,
  SiteAddr,
  prepareSite,
  prepareSiteByContent,
  tv,
} from "libnostrsite";
import { SITE_RELAY, eventId, ndk, userPubkey } from "./nostr";
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

const themes: NDKEvent[] = [];
const themePackages: NDKEvent[] = [];
let settings: PreviewSettings | undefined;
let themeId: string = "";
let addr: SiteAddr | undefined;
let site: NDKEvent | undefined;
let parser: NostrParser | undefined;
let store: NostrStore | undefined;
let renderer: NostrSiteRenderer | undefined;
let preparePromise: any = undefined;
let prepareState: "empty" | "stale" | "ready" = "empty";

// FIXME remove take from libnostrsite
const KIND_THEME = 30514;
const INDEX_URL = "https://cdn.npubpro.com/index.js";

// preload themes asap
const prefetchThemesPromise = (async function prefetchThemes() {
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
  // FIXME if changed - launch the 'prepare' thing
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
        console.log("got session token");
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
    const r = await fetch(url, {
      credentials: "include",
    });
    if (r.status === 200) return r;
    if (r.status === 401) {
      // ensure we're authed
      await getSessionToken();
      // retry
      return await fetch(url);
    } else {
      return r;
    }
  } catch (e) {
    console.log("fetch error", e);
    throw e;
  }
}

async function prepareSiteReserve() {
  if (!settings) throw new Error("No settings");
  if (!themeId) throw new Error("No theme id");

  const theme = themes.find((t) => eventId(t) === themeId);
  if (!theme) throw new Error("No theme");

  const siteSettings = await prepareSite(ndk, settings.admin, {
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
  console.log("site", siteSettings);

  site = new NDKEvent(ndk, siteSettings);

  // site name
  const identifier = tv(site, "d") || "";
  addr = {
    name: identifier,
    pubkey: settings.admin,
    relays: [],
  };

  // to figure out the hashtags and navigation we have to load the
  // site posts first, this is kinda ugly and slow but easier to reuse
  // the fetching logic this way
  parser = new NostrParser(`https://${identifier}.${NPUB_PRO_DOMAIN}/`);
  const info = await parser.parseSite(addr, site);
  store = new NostrStore("preview", ndk, info, parser);
  await store.load(50);
  await prepareSiteByContent(site, store);

  const requestedDomain = settings.domain || identifier;
  const naddrDomain = nip19.naddrEncode({
    identifier,
    kind: KIND_SITE,
    pubkey: settings.admin,
  });
  // console.log("naddrDomain", naddrDomain);
  // console.log("requesting domain", requestedDomain);
  // const reply = await fetchWithSession(
  //   `${NPUB_PRO_API}/reserve?domain=${requestedDomain}&site=${naddrDomain}`
  // ).then((r) => r.json());
  // console.log(Date.now(), "got domain", reply);

  // const subdomain = reply.domain.split("." + NPUB_PRO_DOMAIN)[0];
  // console.log("received domain", subdomain);
  // const origin = `https://${reply.domain}/`;
  // siteSettings.tags.push(["r", origin]);
  siteSettings.tags.push(["r", "https://site.com/"]);

  // now we're ready
  console.log("final site event", siteSettings);
}

export async function preparePreview() {
  // make sure themes are ready
  await prefetchThemesPromise;

  // mutex
  if (preparePromise) await preparePromise;

  // prepare
  console.log("prepareState", prepareState);
  if (prepareState === "stale") {
    preparePromise = prepareSiteReserve().then(() => {
      prepareState = "ready";
      console.log("prepareState", prepareState);
    });
  }

  return preparePromise;
}

export async function renderPreview(path: string = "/") {
  console.log("render", path);
  if (!addr || !site || !parser || !store) throw new Error("No site");

  const theme = themes.find((t) => eventId(t) === themeId);
  console.log("theme", theme, "id", themeId, "themes", themes);
  if (!theme) throw new Error("No theme");

  const pkg = themePackages.find((p) => p.id === tv(theme, "e"));
  if (!pkg) throw new Error("No theme package");

  const parsedTheme = await parser.parseTheme(pkg);
  console.log("parsedTheme", parsedTheme);

  if (!renderer) {
    try {
      const r = new NostrSiteRenderer();
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
