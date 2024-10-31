import { nip19 } from "nostr-tools";
import { getSiteSettings, parser } from "./api";
import {
  SEARCH_RELAYS,
  getOutboxRelays,
  ndk,
  userIsDelegated,
  userPubkey,
  userRelays,
} from "./nostr";
import {
  fetchEvents,
  createSiteFilters,
  matchPostsToFilters,
  Post,
  eventId,
  Site,
  KIND_SITE_SUBMIT,
  parseAddr,
  KIND_SITE,
  SITE_RELAY,
  fetchEvent,
} from "libnostrsite";
import {
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKRelaySet,
} from "@nostr-dev-kit/ndk";

export type SearchPost = Post & {
  status: string;
};

export type TypeSearchPosts = {
  authors?: string[];
  kinds?: number[];
  hashtags?: string[];
  since?: number;
  until?: number;
  search?: string;
};

export const SUBMIT_STATUS_NONE = "";
export const SUBMIT_STATUS_AUTO = "auto";
export const SUBMIT_STATUS_MANUAL = "manual";

export async function searchPosts(
  siteId: string,
  { authors, kinds, hashtags, since, until, search }: TypeSearchPosts
): Promise<SearchPost[]> {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  const filters = createSiteFilters({
    since,
    until,
    authors,
    kinds,
    hashtags,
    limit: 50,
    settings: site,
  });

  const relays = [...site.contributor_relays];
  if (search) {
    search += " include:spam";
    relays.length = 0;
    relays.push(...SEARCH_RELAYS);
  }
  if (!relays.length) relays.push(...SEARCH_RELAYS);

  const events = await fetchEvents(
    ndk,
    filters.map((f) => ({
      ...f,
      search,
    })),
    relays
  );

  // make sure it matches our other local filter
  const valid = [...events].filter((e) => matchPostsToFilters(e, filters));

  // used to mark as 'auto-submitted'
  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });

  // convert to posts
  const posts = [];
  for (const e of valid) {
    const post = (await parser.parseEvent(e)) as SearchPost;
    if (!post) continue;

    post.status = SUBMIT_STATUS_NONE;

    // status
    if (matchPostsToFilters(e, autoFilters)) post.status = SUBMIT_STATUS_AUTO;

    posts.push(post);
  }

  // mark as manual-submitted
  const ids = posts.map((p) => p.id);
  const submits = await fetchSubmits(site, ids);
  for (const p of posts) {
    if (submits.find((s) => s.eventAddress === p.id))
      p.status = SUBMIT_STATUS_MANUAL;
  }

  // add hashtags
  for (const post of posts) {
    // FIXME wtf? move to libnostrsite
    // @ts-ignore
    const hashtags = parser.parseHashtags(post.event);
    // @ts-ignore
    post.tags = hashtags.map((t) => ({
      id: t.toLocaleLowerCase(),
      name: t,
    }));

    // FIXME also take from submits
  }

  return posts;
}

function eventIdToTag(id: string) {
  const { type, data } = nip19.decode(id);
  switch (type) {
    case "note":
      return data;
    case "naddr":
      return `${data.kind}:${data.pubkey}:${data.identifier}`;
    default:
      throw new Error("Invalid related id " + id);
  }
}

async function fetchSubmits(site: Site, ids: string[]) {
  const idFilter: NDKFilter = {
    "#e": [],
    // @ts-ignore
    kinds: [KIND_SITE_SUBMIT],
    authors: [...site.contributor_pubkeys, site.admin_pubkey],
  };
  const addrFilter: NDKFilter = {
    "#a": [],
    // @ts-ignore
    kinds: [KIND_SITE_SUBMIT],
    authors: [...site.contributor_pubkeys, site.admin_pubkey],
  };

  for (const id of ids) {
    const tag = eventIdToTag(id);
    if (tag.includes(":")) addrFilter["#a"]!.push(tag);
    else idFilter["#e"]!.push(tag);
  }

  const filters: NDKFilter[] = [];
  if (idFilter["#e"]?.length) filters.push(idFilter);
  if (addrFilter["#a"]?.length) filters.push(addrFilter);
  const events = await fetchEvents(
    ndk,
    filters,
    [...userRelays, ...SEARCH_RELAYS],
    3000
  );

  const submits = [];
  for (const e of events) {
    const s = await parser.parseSubmitEvent(e);
    if (s) submits.push(s);
  }
  return submits;
}

async function getRelayHint(pubkey: string, id: string) {
  const relays = await getOutboxRelays(pubkey);
  const filter: NDKFilter = {
    authors: [pubkey],
  };

  const { type, data } = nip19.decode(id);
  switch (type) {
    case "note":
      filter.ids = [data];
      break;
    case "naddr":
      filter.kinds = [data.kind];
      filter["#d"] = [data.identifier];
      break;
    default:
      throw new Error("Bad id");
  }
  const event = await fetchEvent(ndk, filter, relays, 1000);
  return event?.relay?.url || SEARCH_RELAYS[0];
}

export async function submitPost(
  siteId: string,
  {
    id,
    author,
    kind,
    url,
  }: { id: string; author: string; kind: number; url: string }
) {
  if (userIsDelegated) throw new Error("Cannot sign event in delegated mode");

  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  const addr = parseAddr(siteId);
  const siteAddress = `${KIND_SITE}:${addr.pubkey}:${addr.identifier}`;
  const eventIdTag = eventIdToTag(id);

  const event = {
    kind: KIND_SITE_SUBMIT,
    pubkey: userPubkey,
    created_at: Math.floor(Date.now() / 1000),
    content: "",
    tags: [
      ["d", `${siteAddress}_${eventIdTag}`],
      [
        "s",
        siteAddress,
        site.admin_relays.length ? site.admin_relays[0] : SITE_RELAY,
      ],
      ["k", "" + kind],
      ["p", author],
    ],
  };
  if (url) event.tags.push(["r", url]);

  const relay = await getRelayHint(author, id);

  if (eventIdTag.includes(":")) event.tags.push(["a", eventIdTag, relay]);
  else event.tags.push(["e", eventIdTag, relay]);

  // sign it
  const nevent = new NDKEvent(ndk, event);
  await nevent.sign(new NDKNip07Signer());
  console.log("submit post event", nevent);

  // publish
  const r = await nevent.publish(
    NDKRelaySet.fromRelayUrls([...userRelays, ...SEARCH_RELAYS], ndk)
  );
  console.log(
    "published submit event to",
    [...r].map((r) => r.url)
  );
  if (!r.size) throw new Error("Failed to publish to relays");
}
