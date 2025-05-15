import { generatePrivateKey, getPublicKey, nip19 } from "nostr-tools";
import {
  SEARCH_RELAYS,
  SEARCH_RELAYS_SPAM,
  addOnAuth,
  fetchWithSession,
  ndk,
  publishSiteEvent,
  srm,
  stv,
  userIsDelegated,
  userProfile,
  userPubkey,
  userRelays,
} from "./nostr";
import {
  KIND_LONG_NOTE,
  KIND_NOTE,
  KIND_OLAS,
  KIND_SITE_SUBMIT,
  KIND_VIDEO_HORIZONTAL,
  KIND_VIDEO_VERTICAL,
  NostrParser,
  SITE_RELAY,
  SUBMIT_STATE_ADD,
  eventId,
  fetchEvents,
  getProfileSlug,
  isAudioUrl,
  isImageUrl,
  isVideoUrl,
  prepareSite,
  tv,
} from "libnostrsite";
import { NDKEvent, NDKRelaySet, NostrEvent } from "@nostr-dev-kit/ndk";
import { NPUB_PRO_DOMAIN, THEMES_PREVIEW } from "@/consts";
import { fetchThemePackage, setSiteThemePackage } from "./themes";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";
import { SERVER_PUBKEY } from "./consts";
import { eventIdToTag } from "./utils";
import { signSubmitEvent } from "./content";
import { resetSites } from "./api";

const DEFAULT_THEMES: any = {
  blog: THEMES_PREVIEW.find((t) => t.name === "Simply"),
  photo: THEMES_PREVIEW.find((t) => t.name === "Edge"),
  video: THEMES_PREVIEW.find((t) => t.name === "Paway"),
  note: THEMES_PREVIEW.find((t) => t.name === "Micro-simply"),
  podcast: THEMES_PREVIEW.find((t) => t.name === "Wave"),
};

export async function setAuth(event: any) {
  console.log("set auth", event);

  // add listener before sending our event
  // to make sure we receive the event
  const promise = new Promise<void>((ok) => {
    addOnAuth(async (type: string) => {
      if (type !== "logout") ok();
    });
  });

  // notify nostr-login
  document.dispatchEvent(new CustomEvent("nlSetAuth", { detail: event }));

  // wait for onAuth from nostr-login
  await promise;
}

export async function signup(username: string) {
  const sk = generatePrivateKey();
  const pubkey = getPublicKey(sk);
  return setAuth({
    type: "signup",
    method: "local",
    pubkey,
    name: username,
    localNsec: sk,
  });
}

export async function loginOTP(pubkey: string, otpData: any) {
  return setAuth({
    type: "login",
    method: "otp",
    pubkey,
    otpData: JSON.stringify(otpData),
  });
}

export type SiteType = "" | "blog" | "photo" | "video" | "note" | "podcast";

async function fetchContent(pubkey: string, kinds: number[], min: number) {
  return await fetchEvents(
    ndk,
    {
      authors: [pubkey],
      kinds,
      limit: min,
    },
    SEARCH_RELAYS_SPAM,
    1000,
  );
}

function isRoot(n: NDKEvent) {
  return !n.tags.find(
    (t) => t.length >= 4 && (t[0] === "a" || t[0] === "e") && t[3] === "root",
  );
}

function isVideo(parser: NostrParser, r: NDKEvent) {
  const links: string[] = parser.parseLinks(r);
  return links.find((l) => isVideoUrl(l, r as NostrEvent));
}

function isImage(parser: NostrParser, r: NDKEvent) {
  const links: string[] = parser.parseLinks(r);
  return links.find((l) => isImageUrl(l, r as NostrEvent));
}

function isAudio(parser: NostrParser, r: NDKEvent) {
  const links: string[] = parser.parseLinks(r);
  return links.find((l) => isAudioUrl(l, r as NostrEvent));
}

export async function detectContentType(
  pubkey: string,
): Promise<[SiteType, number[]]> {
  const fetch = async (kinds: number[], min: number) => {
    return await fetchContent(pubkey, kinds, min);
  };

  const has = async (kinds: number[], min: number) => {
    return (await fetch(kinds, min)).size >= min;
  };

  if (await has([KIND_LONG_NOTE], 1)) return ["blog", [KIND_LONG_NOTE]];
  if (await has([KIND_OLAS], 10)) return ["photo", [KIND_OLAS]];
  if (await has([KIND_VIDEO_HORIZONTAL, KIND_VIDEO_VERTICAL], 10))
    return ["video", [KIND_VIDEO_HORIZONTAL, KIND_VIDEO_VERTICAL]];

  const notes = await fetch([KIND_NOTE], 100);
  console.log("notes", notes.size);
  const roots = [...notes].filter((n) => !isRoot(n));
  console.log("roots", roots.length);

  // nothing?
  if (!roots.length) return ["", []];

  // not enough sample size, but still something?
  if (roots.length < 10) return ["note", [KIND_NOTE]];

  const parser = new NostrParser();

  // video has priority in notes
  const video =
    roots.filter((r) => isVideo(parser, r)).length >= roots.length / 2;
  if (video) return ["video", [KIND_NOTE]];

  const photo =
    roots.filter((r) => isImage(parser, r)).length >= roots.length / 2;
  if (photo) return ["photo", [KIND_NOTE]];

  // default
  return ["note", [KIND_NOTE]];
}

export async function createSite(
  pubkey: string,
  type: SiteType,
  kinds: number[],
) {
  if (!type) throw new Error("Invalid type");
  const theme = DEFAULT_THEMES[type];
  if (!theme) throw new Error("Invalid theme name");

  const pkg = await fetchThemePackage(theme.id);

  // start from zero, prepare site event from input settings,
  // fill everything with defaults
  const tmpl = await prepareSite(ndk, userPubkey, {
    contributorPubkeys: [pubkey],
    kinds,
  });
  const site = new NDKEvent(ndk, tmpl);

  // admin not contributor?
  let slug = tv(site, "d") || "";
  if (pubkey !== userPubkey) {
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
  stv(site, "d", slug);
  console.log("site slug", slug);

  // make sure d-tag is unique, use ':' as
  // suffix separator so that we could parse it and extract
  // the original d-tag to use as preferred domain name,
  // use longer random suffix for delegated sites
  const d_tag = tv(site, "d");
  stv(
    site,
    "d",
    d_tag + ":" + bytesToHex(randomBytes(userIsDelegated ? 8 : 3)),
  );

  if (userIsDelegated) {
    // set admin as owner, server as event author
    stv(site, "u", userPubkey);
    site.pubkey = SERVER_PUBKEY!;
  }

  // drop these - we're manually adding posts
  srm(site, "include");
  srm(site, "kind");
  // remove the contributor
  srm(site, "p");

  // set current theme
  setSiteThemePackage(pkg, site);

  console.log("site", site.rawEvent());

  const POST_NUM = 16;
  // fetch 10x events to make sure we have enough after filtering
  const events = await fetchContent(pubkey, kinds, POST_NUM * 10);

  // find 10 good
  const parser = new NostrParser();
  const good: NDKEvent[] = [];
  for (const e of [...events]) {
    if (e.kind === KIND_NOTE && type !== "note") {
      if (type === "video" && isVideo(parser, e)) good.push(e);
      else if (type === "photo" && isImage(parser, e)) good.push(e);
      else if (type === "podcast" && (isAudio(parser, e) || isVideo(parser, e)))
        good.push(e);
    } else {
      good.push(e);
    }
  }
  if (good.length > POST_NUM) good.length = POST_NUM;
  console.log("good", good);

  const identifier = tv(site, "d") || "";
  const siteAddress = `${site.kind!}:${site.pubkey}:${identifier}`;
  for (const e of good) {
    const id = eventId(e);
    let eventIdTag: string;
    try {
      eventIdTag = eventIdToTag(id);
    } catch (e) {
      console.log("error", e, id);
      continue;
    }

    const pubkey = userIsDelegated ? SERVER_PUBKEY : userPubkey;
    const event = {
      kind: KIND_SITE_SUBMIT,
      pubkey,
      created_at: Math.floor(Date.now() / 1000),
      content: "",
      tags: [
        ["d", `${siteAddress}_${eventIdTag}`],
        ["s", siteAddress, SITE_RELAY],
        ["k", "" + e.kind],
        ["p", e.pubkey],
        ["state", SUBMIT_STATE_ADD],
      ],
    };

    const relayHint = e.relay!.url!;
    if (eventIdTag.includes(":")) event.tags.push(["a", eventIdTag, relayHint]);
    else event.tags.push(["e", eventIdTag, relayHint!]);

    const nevent = await signSubmitEvent(event);
    const r = await nevent.publish(
      NDKRelaySet.fromRelayUrls([...userRelays, ...SEARCH_RELAYS], ndk),
    );

    console.log("submit ", id, nevent.rawEvent(), "to relays", r.size);
  }

  // naddr to reserve and deploy
  const naddr = nip19.naddrEncode({
    identifier: identifier,
    kind: site.kind!,
    pubkey: site.pubkey,
  });
  console.log("publishing", naddr, site);

  // reserve a subdomain
  const requestedDomain = tv(site, "d")!.split(":")[0].replace("_", "-");
  console.log("naddr", naddr);
  console.log("requesting domain", requestedDomain);
  const reply = await fetchWithSession(
    `/reserve?domain=${requestedDomain}&site=${naddr}`,
  );
  if (reply.status !== 200) throw new Error("Failed to reserve domain name");
  const reserve = await reply.json();
  console.log(Date.now(), "got domain", reserve);

  // set reserved domain to the event
  const subdomain = reserve.domain.split("." + NPUB_PRO_DOMAIN)[0];
  console.log("received domain", subdomain);
  const origin = `https://${reserve.domain}/`;
  srm(site, "r");
  stv(site, "r", origin);

  // publish site event
  const event = await publishSiteEvent(site);
  console.log("published site event", event);

  // deploy
  const deployReply = await fetchWithSession(
    `/deploy?domain=${new URL(origin).hostname}&site=${naddr}`,
  );
  if (deployReply.status !== 200) throw new Error("Failed to deploy");
  const r = await deployReply.json();
  console.log(Date.now(), "deployed", r);

  // make sure sites cache is clear to fetch this newly published site
  resetSites();

  return naddr;
}
