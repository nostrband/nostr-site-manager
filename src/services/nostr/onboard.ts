import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { SEARCH_RELAYS, SEARCH_RELAYS_SPAM, addOnAuth, ndk } from "./nostr";
import {
  KIND_LONG_NOTE,
  KIND_NOTE,
  KIND_OLAS,
  KIND_VIDEO_HORIZONTAL,
  KIND_VIDEO_VERTICAL,
  NostrParser,
  fetchEvents,
  isImageUrl,
  isVideoUrl,
} from "libnostrsite";
import { NostrEvent } from "@nostr-dev-kit/ndk";
import { THEMES_PREVIEW } from "@/consts";
import { setPreviewSettings } from "./themes";

const DEFAULT_THEMES = {
  blog: THEMES_PREVIEW.find((t) => t.name === "Simply"),
  photo: THEMES_PREVIEW.find((t) => t.name === "Edge"),
  video: THEMES_PREVIEW.find((t) => t.name === "Paway"),
  note: THEMES_PREVIEW.find((t) => t.name === "Micro-simply"),
};

export async function setAuth(event: any) {
  console.log("set auth", event);

  // add listener before sending our event
  // to make sure we receive the event
  const promise = new Promise<void>((ok) => {
    addOnAuth(async (type: string) => {
      if (type === "login") ok();
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

export type SiteType = "" | "blog" | "photo" | "video" | "note";

export async function detectContentType(
  pubkey: string
): Promise<[SiteType, number[]]> {
  const fetch = async (kinds: number[], min: number) => {
    return await fetchEvents(
      ndk,
      {
        authors: [pubkey],
        kinds,
        limit: min,
      },
      SEARCH_RELAYS_SPAM,
      1000
    );
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
  const roots = [...notes].filter(
    (n) =>
      !n.tags.find(
        (t) =>
          t.length >= 4 && (t[0] === "a" || t[0] === "e") && t[3] === "root"
      )
  );
  console.log("roots", roots.length);

  // nothing?
  if (!roots.length) return ["", []];

  // not enough sample size, but still something?
  if (roots.length < 10) return ["note", [KIND_NOTE]];

  const parser = new NostrParser();

  // video has priority in notes
  const video =
    roots.filter((r) => {
      const links: string[] = parser.parseLinks(r);
      return links.find((l) => isVideoUrl(l, r as NostrEvent));
    }).length >=
    roots.length / 2;
  if (video) return ["video", [KIND_NOTE]];

  const photo =
    roots.filter((r) => {
      const links: string[] = parser.parseLinks(r);
      return links.find((l) => isImageUrl(l, r as NostrEvent));
    }).length >=
    roots.length / 2;
  if (photo) return ["photo", [KIND_NOTE]];

  // default
  return ["note", [KIND_NOTE]];
}

export async function createSite(
  pubkey: string,
  type: SiteType,
  kinds: number[]
) {
  if (!type) throw new Error("Invalid type");
  const theme = DEFAULT_THEMES[type];
  if (!theme) throw new Error("Invalid theme name");

  // difference vs old onboarding:
  // no include tags,
  // instead we auto-submit last 10 posts right?
  // hmm if it's their own site then why not import everything?
  // - to make the site more beautiful
  // - bcs there won't be auto-submit soon!
  // ok, so kinds are passed but after site template is created 
  // we should remove all "include" and "kind" tags and 
  // submit some posts.

  // there's a lot of internal login in generating a site,
  // one of them relates to setting up navigation from existing
  // content, which means we FIRST have to get the siteId,
  // then need to submit some posts, and then LOAD them,
  // and then init the navigation and save the site

  // also shall we use admin-contrib subdomain this time?
  // we will no longer be creating sites with different author,
  // in onboarding that's "sample site", later on we should
  // probably create empty sites without navigation
  // and without content... 

  // hmm... it's actually pretty useful to be able to
  // create site "from other author's perspective"... 
  // so maybe we should keep that thing?

  // need more thinking here!



  setPreviewSettings({
    themeId: theme.id,
    kinds,
    contributors: [pubkey],
  });
}
