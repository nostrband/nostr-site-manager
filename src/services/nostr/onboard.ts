import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { SEARCH_RELAYS, SEARCH_RELAYS_SPAM, addOnAuth, ndk } from "./nostr";
import { KIND_LONG_NOTE, KIND_NOTE, KIND_OLAS, KIND_VIDEO_HORIZONTAL, KIND_VIDEO_VERTICAL, NostrParser, fetchEvents, isImageUrl, isVideoUrl } from "libnostrsite";
import { NostrEvent } from "@nostr-dev-kit/ndk";

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
    otpData,
  });
}

async function detectContentType(pubkey: string) {

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

  if (await has([KIND_LONG_NOTE], 1)) return "blog";
  if (await has([KIND_OLAS], 10)) return "photo";
  if (await has([KIND_VIDEO_HORIZONTAL, KIND_VIDEO_VERTICAL], 10))
    return "video";

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
  if (!roots.length) return "";

  // not enough sample size, but still something?
  if (roots.length < 10) return "note";

  const parser = new NostrParser();

  // video has priority in notes
  const video =
    roots.filter((r) => {
      const links: string[] = parser.parseLinks(r);
      return links.find((l) => isVideoUrl(l, r as NostrEvent));
    }).length >= 10;
  if (video) return "video";

  const photo =
    roots.filter((r) => {
      const links: string[] = parser.parseLinks(r);
      return links.find((l) => isImageUrl(l, r as NostrEvent));
    }).length >= 10;
  if (photo) return "photo";

  // default
  return "note";
}
