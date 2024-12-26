import { KIND_SITE, KIND_SITE_FILE, fetchOutboxRelays, fetchSiteFile, parseAddr } from "libnostrsite";
import { findSiteEvent } from "./api";
import { ndk, userIsDelegated, userPubkey } from "./nostr";
import { NDKEvent, NDKNip07Signer, NDKRelaySet } from "@nostr-dev-kit/ndk";

export const NOSTR_JSON_FILE = "/.well-known/nostr.json";

export async function fetchNostrJson(siteId: string) {
  const siteEvent = findSiteEvent(siteId);

  const relays = await fetchOutboxRelays(ndk, [siteEvent!.pubkey]);

  const nostrJsonEvent = await fetchSiteFile(
    ndk,
    siteId,
    NOSTR_JSON_FILE,
    relays
  );

  if (!nostrJsonEvent) return undefined;

  try {
    JSON.parse(nostrJsonEvent.content);
    return nostrJsonEvent.content;
  } catch (e) {
    console.log("Failed to parse nostr json event", nostrJsonEvent.content);
  }

  return undefined;
}

export async function editNostrJson(siteId: string, content: string) {
  if (userIsDelegated) throw new Error("Can't save nostr.json in delegated mode");

  const addr = parseAddr(siteId);
  const s_tag = `${KIND_SITE}:${addr!.pubkey}:${addr!.identifier}`;
  const d_tag = `${NOSTR_JSON_FILE}:${s_tag}`;

  // read from stdin
  const json = JSON.parse(content);
  const event = new NDKEvent(ndk, {
    kind: KIND_SITE_FILE,
    pubkey: userPubkey,
    content: JSON.stringify(json),
    created_at: Math.floor(Date.now() / 1000),
    tags: [
      ["d", d_tag],
      ["s", s_tag],
    ],
  });

  await event.sign(new NDKNip07Signer());
  console.log("signed", event.rawEvent());

  const relays = await fetchOutboxRelays(ndk, [addr!.pubkey]);
  const r = await event.publish(NDKRelaySet.fromRelayUrls(relays, ndk));
  console.log("published at", r);
}