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
  Submit,
  scanRelays,
  fetchByIds,
  SUBMIT_STATE_ADD,
  SUPPORTED_KINDS,
  SUBMIT_STATE_REMOVE,
  tags,
} from "libnostrsite";
import {
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKRelaySet,
} from "@nostr-dev-kit/ndk";

export type SearchPost = Post & {
  submitterPubkey: string;
  autoSubmitted: boolean;
};

export type TypeSearchPosts = {
  authors?: string[];
  kinds?: number[];
  hashtags?: string[];
  since?: number;
  until?: number;
  search?: string;
};

// site => posts
const submitsCache = new Map<string, SearchPost[]>();

function createAutoFilters(site: Site) {
  return createSiteFilters({
    limit: 1,
    settings: site,
  });
}
export const suggestPosts = async (siteId: string) => {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  const existing = await filterSitePosts(siteId, {});

  // use existing content to find authors, kinds and hashtags
  return searchPosts(
    siteId,
    {
      authors: [...new Set(existing.map((e) => e.event.pubkey))],
      kinds: [...new Set(existing.map((e) => e.event.kind!))],
      hashtags: [
        ...new Set(
          existing.map((e) => tags(e.event, "t").map((t) => t[1])).flat()
        ),
      ],
    },
    // onlyNew
    true
  );
};

export const searchPosts = async (
  siteId: string,
  { authors, kinds, hashtags, since, until, search }: TypeSearchPosts,
  onlyNew?: boolean
): Promise<SearchPost[]> => {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  // to mark search results as 'auto-submitted'
  const autoFilters = createAutoFilters(site);

  // to mark search results as 'submitted'
  const submitted = await fetchSubmits(site);

  // prepare filters
  const limit = 50;
  const filters: NDKFilter[] = [];
  const add = (kind: number, tag?: { tag: string; value: string }) => {
    const tagKey = "#" + tag?.tag;
    // reuse filters w/ same tag
    let f: NDKFilter | undefined = filters.find((f) => {
      // if (!f.kinds?.includes(kind)) return false;
      if (!tag) return !Object.keys(f).find((k) => k.startsWith("#"));
      else return tagKey in f;
    });

    if (!f) {
      // first filter for this tag
      f = {
        authors,
        kinds: [kind],
        limit,
      };
      if (tag) {
        // @ts-ignore
        f[tagKey] = [tag.value];
      }
      if (since) {
        f.since = since;
      }
      if (until) {
        f.until = until;
      }
      if (search) {
        f.search = search;
      }

      // append new filter
      filters.push(f);
    } else {
      // append tag and kind
      if (tag) {
        // @ts-ignore
        if (!f[tagKey].includes(tag.value)) {
          // @ts-ignore
          f[tagKey].push(tag.value);
        }
      }
      if (!f.kinds!.includes(kind)) f.kinds!.push(kind);
    }
  };

  if (!kinds) {
    kinds = SUPPORTED_KINDS;
  }

  const addAll = (tag?: { tag: string; value: string }) => {
    for (const k of kinds!) add(k, tag);
  };

  if (hashtags) {
    for (const t of hashtags) addAll({ tag: "t", value: t });
  } else {
    addAll();
  }
  console.log("search filters", filters);

  // search
  const events = await fetchEvents(
    ndk,
    filters,
    // NOTE: we are looking for different authors and it's quite
    // hard to fetch relays for all of them, so for now we just opt-in
    // to use search relays for finding posts to submit
    SEARCH_RELAYS
  );

  console.log("searched events", events);

  const posts: SearchPost[] = [];
  for (const e of events) {
    const post = (await parser.parseEvent(e)) as SearchPost;
    if (!post) continue;

    post.autoSubmitted = matchPostsToFilters(e, autoFilters);
    post.submitterPubkey =
      submitted.find((s) => s.id === post.id)?.submitterPubkey || "";

    // skip
    if (onlyNew && (post.autoSubmitted || post.submitterPubkey)) continue;

    // add
    posts.push(post);
  }

  // repeat the query if everything we've found so far has
  // been filtered out
  if (!posts.length && events.size) {
    const arr = [...events];
    return searchPosts(
      siteId,
      {
        authors,
        kinds,
        hashtags,
        since,
        search,
        until:
          arr.reduce(
            (minCreatedAt: number, e: NDKEvent) =>
              Math.min(minCreatedAt, e.created_at!),
            arr[0].created_at!
          ) - 1, // before that last one of current set
      },
      onlyNew
    );
  }

  return posts;
};

export async function filterSitePosts(
  siteId: string,
  { authors, kinds, hashtags, since, until, search }: TypeSearchPosts
): Promise<SearchPost[]> {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  // cached for each site
  const submittedPosts = await fetchSubmits(site);

  // filter using search query
  const posts = [
    ...submittedPosts.filter((p) => {
      // FIXME parse into words, match with words like relay does
      return (
        !search || p.title?.includes(search) || p.markdown?.includes(search)
      );
    }),
  ];

  // FIXME soon we'll get rid of auto-filters
  // and will only work with submitted events!
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

    // only search relay
    relays.length = 0;
    relays.push(...SEARCH_RELAYS);
  }
  if (!relays.length) relays.push(...SEARCH_RELAYS);

  const autoEvents = await fetchEvents(
    ndk,
    filters.map((f) => ({
      ...f,
      search,
    })),
    relays
  );

  // make sure it matches our other local filters (skip replies etc)
  const valid = [...autoEvents].filter((e) => matchPostsToFilters(e, filters));

  // used to mark as 'auto-submitted'
  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });

  // convert filtered events to posts
  for (const e of valid) {
    // skip ones that are manually submitted
    if (submittedPosts.find((p) => p.id === eventId(e))) continue;

    // parse
    const post = (await parser.parseEvent(e)) as SearchPost;
    if (!post) continue;

    post.submitterPubkey = "";
    post.autoSubmitted = false;

    // status
    if (matchPostsToFilters(e, autoFilters)) post.autoSubmitted = true;

    posts.push(post);
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

async function fetchSubmits(site: Site) {
  const cached = submitsCache.get(site.id);
  if (cached) return cached;

  const filter: NDKFilter = {
    // @ts-ignore
    kinds: [KIND_SITE_SUBMIT],
    authors: [...site.contributor_pubkeys, site.admin_pubkey],
  };

  const events = await scanRelays(ndk, filter, userRelays, 10000, {
    batchSize: 1000,
    threads: 5,
    timeout: 10000,
  });

  const relayHints = [...userRelays];
  const submits = new Map<string, Submit>();
  for (const e of events) {
    const submit = await parser.parseSubmitEvent(e);
    if (!submit) continue;

    const existing = submits.get(submit.eventAddress);
    if (!existing || existing.event!.created_at < submit.event.created_at) {
      submits.set(submit.eventAddress, submit);
      relayHints.push(submit.relay);
    }
  }

  const ids = [...submits.values()]
    .filter((s) => s.state === SUBMIT_STATE_ADD)
    .map((s) => s.eventAddress);

  const submittedEvents = await fetchByIds(ndk, ids, relayHints);

  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });

  const posts: SearchPost[] = [];
  for (const e of submittedEvents) {
    const post = (await parser.parseEvent(e)) as SearchPost;
    if (!post) continue;

    const submit = submits.get(post.id);
    // hmm...
    if (!submit) continue;

    post.submitterPubkey = submit.event.pubkey;
    post.autoSubmitted = matchPostsToFilters(post.event, autoFilters);
    posts.push(post);
  }

  submitsCache.set(site.id, posts);
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

async function getSubmitEvent(pubkey: string, id: string) {
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
      filter.authors = [data.pubkey];
      filter["#d"] = [data.identifier];
      break;
    default:
      throw new Error("Bad id");
  }
  const event = await fetchEvent(ndk, filter, relays, 1000);
  return {
    event,
    relay: event?.relay?.url || SEARCH_RELAYS[0],
  };
}

export async function submitPost(
  siteId: string,
  {
    id,
    author,
    kind,
    url,
    remove,
  }: { id: string; author: string; kind: number; url: string; remove: boolean }
) {
  if (userIsDelegated) throw new Error("Cannot sign event in delegated mode");

  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  // we need event itself and a relay hint
  const { relay, event: submittedEvent } = await getSubmitEvent(author, id);
  if (!submittedEvent) throw new Error("Failed to fetch submitted event");

  // we also convert the submitted event to a post to cache it
  const post = (await parser.parseEvent(submittedEvent)) as SearchPost;
  if (!post) throw new Error("Failed to parse submitted event");

  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });
  post.autoSubmitted = matchPostsToFilters(post.event, autoFilters);
  post.submitterPubkey = userPubkey;

  // now prepare submit event
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
  if (remove) event.tags.push(["state", SUBMIT_STATE_REMOVE]);
  else event.tags.push(["state", SUBMIT_STATE_ADD]);

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

  // update cache
  let submitted = submitsCache.get(site.id) || [];

  // remove from submitted
  submitted = submitted.filter((s) => s.id === id);
  if (!remove) {
    // add back with current user as submitter
    submitted.push(post);
  }
}
