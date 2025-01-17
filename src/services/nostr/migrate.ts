import { NDKEvent } from "@nostr-dev-kit/ndk";
import { SERVER_PUBKEY } from "./consts";
import {
  fetchWithSession,
  ndk,
  publishSiteEvent,
  stv,
  userIsDelegated,
  userIsReadOnly,
  userPubkey,
  userRelays,
} from "./nostr";
import { KIND_SITE, SITE_RELAY, eventId, tv } from "libnostrsite";
import { nip19 } from "nostr-tools";
import { fetchSites, findSiteEvent, resetSites } from "./api";

export function isNeedMigrateKey(siteId: string) {
  const event = findSiteEvent(siteId);
  return userIsDelegated || userIsReadOnly || event?.pubkey === SERVER_PUBKEY;
}

export async function migrateToConnectedKey(siteId: string) {
  const pubkey = userPubkey;

  // is user authed with OTP?
  if (userIsDelegated || userIsReadOnly) {
    document.dispatchEvent(
      new CustomEvent("nlLaunch", { detail: "import-otp" }),
    );

    console.log("key migration, old pubkey", pubkey);
    await new Promise<void>((ok, err) => {
      const handler = (e: Event) => {
        const info:
          | {
              type: string;
              method: string;
              pubkey: string;
            }
          // @ts-ignore
          | undefined = e.detail;
        if (!info || info.type !== "login") return;
        console.log("key migration, login pubkey", info.pubkey);
        if (info.pubkey !== pubkey) return err("Switched to wrong key");
        if (info.method === "otp" || info.method === "readOnly")
          throw new Error("Bad auth method");

        document.removeEventListener("nlAuth", handler);

        // give it some time for other modules to handle
        // this auth event
        setTimeout(ok, 1000);
      };
      document.addEventListener("nlAuth", handler);
    });
    console.log("key migration finished");
  }

  if (userIsDelegated || userIsReadOnly)
    throw new Error("Failed to migrate keys");

  const siteEvent = findSiteEvent(siteId);

  let newSiteId = siteId;
  // migrate the event
  // FIXME DEBUG turned off
  if (siteEvent?.pubkey === SERVER_PUBKEY) {
    // make sure d-tag is unique
    let d_tag = tv(siteEvent, "d") || "" + Date.now();
    do {
      const naddr = nip19.naddrEncode({
        pubkey,
        identifier: d_tag,
        kind: KIND_SITE,
      });

      // have we already published an event for this url?
      const existingEvent = findSiteEvent(naddr);
      if (!existingEvent || tv(existingEvent, "r") === tv(siteEvent, "r"))
        break;

      d_tag += Date.now();
    } while (d_tag.length < 50);

    // create & publish a new site w/ our pubkey as author
    const event = new NDKEvent(ndk, siteEvent);
    event.pubkey = pubkey;
    stv(event, "d", d_tag);

    // publish
    const relays = [...userRelays, SITE_RELAY];
    console.log(
      "publishing new site",
      event,
      "from old site",
      siteEvent,
      "to",
      relays,
    );
    const newSite = await publishSiteEvent(event, relays);
    console.log("published new site event", newSite);

    newSiteId = eventId(newSite);
    console.log(
      "published new site, switching address",
      tv(siteEvent, "r"),
      "from",
      siteId,
      "to",
      newSiteId,
    );

    // migrate
    const reply = await fetchWithSession(
      `/migrate?from=${siteId}&to=${newSiteId}&fromId=${siteEvent.id}&relays=${relays}`,
    );
    if (reply.status !== 200) throw new Error("Failed to migrate");
    const r = await reply.json();
    console.log(Date.now(), "migrated", r);

    // make sure we know about the new site
    resetSites();
    await fetchSites();
  }

  return newSiteId;
}
