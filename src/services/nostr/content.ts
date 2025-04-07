import { Event, nip19 } from "nostr-tools";
import { fetchProfiles, getSiteSettings, parser } from "./api";
import {
  DEFAULT_RELAYS,
  SEARCH_RELAYS,
  fetchWithSession,
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
  Profile,
  OUTBOX_RELAYS,
} from "libnostrsite";
import {
  NDKEvent,
  NDKFilter,
  NDKNip07Signer,
  NDKRelaySet,
  NostrEvent,
} from "@nostr-dev-kit/ndk";
import { marked } from "marked";
import { SERVER_PUBKEY } from "./consts";
import { countItems, eventIdToTag, shuffleArray } from "./utils";

export type SearchPost = Post & {
  submitterPubkey: string;
  submitterProfile?: Profile;
  autoSubmitted: boolean;
  relay?: string;
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
const cache = new Map<string, NDKEvent>();

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

  const authors = [...new Set(existing.map((e) => e.event.pubkey))];
  const kinds = [...new Set(existing.map((e) => e.event.kind!))];
  const allHashtags = existing
    .map((e) => tags(e.event, "t").map((t) => t[1]))
    .flat();
  const hashtagCounts = countItems(allHashtags);
  const hashtags = [...hashtagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((t) => t[0]);

  if (hashtags.length > 10) hashtags.length = 10;

  // use existing content to find authors, kinds and hashtags
  const sameAuthorPosts = await searchPosts(
    siteId,
    {
      authors,
      kinds,
      hashtags,
    },
    // onlyNew
    true,
  );
  if (sameAuthorPosts.length) return sameAuthorPosts;

  // everything by these authors is imported, look
  // at other authors for the same hashtags

  const contacts = await fetchEvents(
    ndk,
    {
      kinds: [3],
      authors,
    },
    OUTBOX_RELAYS,
    3000,
  );
  console.log("contacts", contacts);
  const followed = [
    ...new Set(
      [...contacts]
        .map((c) =>
          c.tags
            .filter((t) => t.length > 1 && t[0] === "p" && t[1].length === 64)
            .map((t) => t[1]),
        )
        .flat(),
    ),
  ];

  // throttle,
  // shuffle first to make sure we don't have bias against old followed
  // profiles that are likely to be dead already
  shuffleArray(followed);
  if (followed.length > 100) followed.length = 100;

  console.log("followed", followed);
  return await searchPosts(
    siteId,
    {
      authors: followed,
      kinds,
      hashtags,
    },
    // onlyNew
    true,
  );
};

export const searchPosts = async (
  siteId: string,
  { authors, kinds, hashtags, since, until, search }: TypeSearchPosts,
  onlyNew?: boolean,
): Promise<SearchPost[]> => {
  console.log("searchPosts", {
    authors,
    kinds,
    hashtags,
    since,
    until,
    search,
  });
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
    SEARCH_RELAYS,
    5000,
  );

  console.log("searched events", events);

  const posts: SearchPost[] = [];
  for (const e of events) {
    const post = (await parser.parseEvent(e)) as SearchPost;
    if (!post) continue;

    cache.set(post.id, e);

    post.autoSubmitted = matchPostsToFilters(e, autoFilters);
    post.submitterPubkey =
      submitted.find((s) => s.id === post.id)?.submitterPubkey || "";
    post.relay = e.relay?.url;

    // skip
    if (onlyNew && (post.autoSubmitted || post.submitterPubkey)) continue;

    // add
    posts.push(post);
  }

  // add authors etc
  await postProcess(posts);

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
            arr[0].created_at!,
          ) - 1, // before that last one of current set
      },
      onlyNew,
    );
  }

  return posts;
};

export async function getSiteContributors(siteId: string) {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  // cached for each site
  const submittedPosts = await fetchSubmits(site);
  return [
    site.admin_pubkey,
    ...site.contributor_pubkeys,
    ...submittedPosts.map((p) => p.event.pubkey),
  ];
}

export async function filterSitePosts(
  siteId: string,
  { authors, kinds, hashtags, since, until, search }: TypeSearchPosts,
): Promise<SearchPost[]> {
  console.log("filterSitePosts", {
    authors,
    kinds,
    hashtags,
    since,
    until,
    search,
  });
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  // cached for each site
  const submittedPosts = await fetchSubmits(site);

  // filter using search query
  const searchLower = search?.toLocaleLowerCase();
  const posts = [
    ...submittedPosts.filter((p) => {
      // FIXME parse into words, match with words like relay does
      const tags = p.tags.map((t) => t.name);
      return (
        (!searchLower ||
          p.title?.toLocaleLowerCase().includes(searchLower) ||
          p.markdown?.toLocaleLowerCase().includes(searchLower) ||
          p.id.toLocaleLowerCase().includes(searchLower)) &&
        (!authors || authors.includes(p.event.pubkey)) &&
        (!kinds || kinds.includes(p.event.kind!)) &&
        (!hashtags || hashtags.find((h) => tags.includes(h))) &&
        (!since || p.event.created_at >= since) &&
        (!until || p.event.created_at <= until)
      );
    }),
  ];
  console.log("submitted filtered posts", posts);

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
  console.log("filters", site, filters);
  if (filters.length) {
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
      relays,
    );

    // used to mark as 'auto-submitted'
    const autoFilters = createSiteFilters({
      limit: 1,
      settings: site,
    });

    // make sure it matches our other local filters (skip replies etc)
    const valid = [...autoEvents].filter((e) =>
      matchPostsToFilters(e, autoFilters),
    );

    // convert filtered events to posts
    for (const e of valid) {
      // skip ones that are manually submitted
      if (posts.find((p) => p.id === eventId(e))) continue;

      // parse
      const post = (await parser.parseEvent(e)) as SearchPost;
      if (!post) continue;

      cache.set(post.id, e);

      post.submitterPubkey = "";
      post.autoSubmitted = false;
      post.relay = e.relay?.url;

      // status
      if (matchPostsToFilters(e, autoFilters)) post.autoSubmitted = true;

      posts.push(post);
      console.log("auto post", post);
    }
  }

  await postProcess(posts);

  return posts;
}

async function postProcess(posts: SearchPost[]) {
  // NOTE: we're searching from nostr.band anyway, so why TF do we
  // mess with adding relay hint?

  // add relay hint to each post id
  // for (const post of posts) {
  //   if (!post.relay) continue;
  //   try {
  //     const { type, data } = nip19.decode(post.id);
  //     if (type === "naddr") {
  //       // FIXME use 'author' field to pass the pubkey
  //       post.id = nip19.naddrEncode({ ...data, relays: [post.relay] });
  //     } else if (type === "note") {
  //       post.id = nip19.neventEncode({ id: data, relays: [post.relay] });
  //     }
  //   } catch (e) {
  //     console.error("error", e, post);
  //   }
  // }

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
    post.primary_tag = post.tags?.[0] || null;
  }

  // add authors
  const pubkeys: string[] = [
    ...posts.map((p) => p.event.pubkey),
    ...posts.filter((p) => p.submitterPubkey).map((p) => p.submitterPubkey),
  ];
  const profiles = await fetchProfiles(pubkeys);
  const getProfile = (pubkey: string) => {
    const event = profiles.find((p) => p.pubkey === pubkey);
    return event ? parser.parseProfile(event) : undefined;
  };

  // add submitter profile
  for (const post of posts) {
    const profile = getProfile(post.event.pubkey);
    if (profile) post.primary_author = await parser.parseAuthor(profile);

    if (post.submitterPubkey)
      post.submitterProfile = getProfile(post.submitterPubkey);
  }

  // make html
  for (const post of posts) {
    post.html = await marked.parse(post.markdown!, {
      // FIXME doesn't work!
      breaks: true, // convert \n to <br>
    });
  }

  // sort
  posts.sort((a, b) => b.event.created_at - a.event.created_at);
}

// FIXME switch to libnostrsite's impl
export function parseNaddr(naddr: string) {
  if (!naddr) return undefined;
  try {
    const { type, data } = nip19.decode(naddr);
    if (type === "naddr") return data;
  } catch (e) {
    console.log("Bad naddr", naddr, e);
  }
  return undefined;
}

export async function fetchPost(site: Site, id: string) {
  let event = cache.get(id);
  if (!event) {
    const { type, data } = nip19.decode(id);
    const relayHints: string[] = [...DEFAULT_RELAYS, ...SEARCH_RELAYS];
    if (type !== "note" && type !== "naddr") throw new Error("Invalid id");

    if (type === "naddr") {
      if (data.relays?.[0]) relayHints.push(data.relays[0]);
      else {
        const relays = await getOutboxRelays(data.pubkey);
        relayHints.push(...relays);
      }
    }

    const events = await fetchByIds(ndk, [id], relayHints);
    if (!events.length) return undefined;

    event = events[0];
  }

  const post = (await parser.parseEvent(event)) as SearchPost;
  console.log("fetchPost post", post);
  if (!post) return undefined;

  cache.set(post.id, event);

  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });

  post.submitterPubkey = "";
  post.autoSubmitted = matchPostsToFilters(event, autoFilters);
  post.relay = event.relay?.url;

  // check if it's submitted
  const addr = parseAddr(site.naddr);
  const s_tag = `${KIND_SITE}:${addr.pubkey}:${addr.identifier}`;

  const filter: NDKFilter = {
    // @ts-ignore
    kinds: [KIND_SITE_SUBMIT],
    authors: [...site.contributor_pubkeys, site.admin_pubkey],
    "#s": [s_tag],
  };
  if (post.id.startsWith("naddr")) {
    const postAddr = parseNaddr(post.id);
    if (!postAddr) throw new Error("Bad post id");
    filter["#a"] = [
      `${postAddr.kind}:${postAddr.pubkey}:${postAddr.identifier}`,
    ];
  } else {
    filter["#e"] = [post.event.id!];
  }

  const submitEvent = await fetchEvent(ndk, filter, userRelays, 1000);
  if (submitEvent) {
    const submit = await parser.parseSubmitEvent(submitEvent);
    if (submit?.eventAddress === post.id && submit.state === SUBMIT_STATE_ADD) {
      post.submitterPubkey = submit.authorPubkey;
    }
  }

  await postProcess([post]);

  return post;
}

export async function fetchSubmits(site: Site) {
  const cached = submitsCache.get(site.id);
  if (cached) return cached;

  const addr = parseAddr(site.naddr);
  const s_tag = `${KIND_SITE}:${addr.pubkey}:${addr.identifier}`;

  const filter: NDKFilter = {
    // @ts-ignore
    kinds: [KIND_SITE_SUBMIT],
    authors: [...new Set([...site.contributor_pubkeys, site.event.pubkey])],
    "#s": [s_tag],
  };

  const events = await scanRelays(ndk, filter, userRelays, 10000, {
    batchSize: 1000,
    threads: 5,
    timeout: 3000,
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
  console.log("submits", site.id, ids, submits);

  const submittedEvents = await fetchByIds(ndk, ids, relayHints);
  console.log("submittedEvents", ids, relayHints, submittedEvents);

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

    cache.set(post.id, e);

    post.submitterPubkey = submit.authorPubkey;
    post.autoSubmitted = matchPostsToFilters(post.event, autoFilters);
    post.relay = e.relay?.url;
    posts.push(post);
    console.log("submitted post", post);
  }

  submitsCache.set(site.id, posts);
  return posts;
}

async function getSubmitEvent(pubkey: string, id: string) {
  const relays = await getOutboxRelays(pubkey);
  relays.push(...SEARCH_RELAYS);

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
  if (event) cache.set(eventId(event), event);
  return {
    event,
    relay: event?.relay?.url || SEARCH_RELAYS[0],
  };
}

export async function signSubmitEvent(event: NostrEvent) {
  let nevent: NDKEvent | undefined;
  if (userIsDelegated) {
    // mark current user as author
    event.tags.push(["u", userPubkey]);
    const reply = await fetchWithSession(`/sign`, event);
    if (reply.status !== 200) throw new Error("Failed to sign submit event");
    const r = await reply.json();
    console.log(Date.now(), "signed submit event", r);
    nevent = new NDKEvent(ndk, r.event);
  } else {
    nevent = new NDKEvent(ndk, event);
    await nevent.sign(new NDKNip07Signer());
  }
  console.log("submit post event", nevent);

  return nevent;
}

export async function submitPost(
  siteId: string,
  {
    id,
    author,
    kind,
    url,
    remove,
  }: { id: string; author: string; kind: number; url: string; remove: boolean },
) {
  const site = await getSiteSettings(siteId);
  if (!site) throw new Error("Unknown site");

  if (userIsDelegated && site.event.pubkey !== SERVER_PUBKEY)
    throw new Error("Can't submit in delegated mode");

  if (
    site.admin_pubkey !== userPubkey &&
    !site.contributor_pubkeys.includes(userPubkey)
  )
    throw new Error("Only admin or contributor can submit posts");

  // we need event itself and a relay hint
  let submittedEvent = cache.get(id);
  let relayHint = submittedEvent?.relay?.url;
  if (!submittedEvent) {
    const { relay, event } = await getSubmitEvent(author, id);
    if (!event) throw new Error("Failed to fetch submitted event");
    submittedEvent = event;
    relayHint = relay;
  }

  // we also convert the submitted event to a post to cache it
  const post = (await parser.parseEvent(submittedEvent)) as SearchPost;
  if (!post) throw new Error("Failed to parse submitted event");

  const autoFilters = createSiteFilters({
    limit: 1,
    settings: site,
  });
  post.autoSubmitted = matchPostsToFilters(post.event, autoFilters);
  if (remove) post.submitterPubkey = "";
  else post.submitterPubkey = userPubkey;
  post.relay = relayHint;

  // add authors & tags
  await postProcess([post]);

  // now prepare submit event
  const addr = parseAddr(siteId);
  const siteAddress = `${KIND_SITE}:${addr.pubkey}:${addr.identifier}`;
  const eventIdTag = eventIdToTag(id);

  const pubkey = userIsDelegated ? SERVER_PUBKEY : userPubkey;
  const event = {
    kind: KIND_SITE_SUBMIT,
    pubkey,
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

  if (eventIdTag.includes(":")) event.tags.push(["a", eventIdTag, relayHint!]);
  else event.tags.push(["e", eventIdTag, relayHint!]);

  // sign it
  const nevent = await signSubmitEvent(event);

  // publish
  const r = await nevent.publish(
    NDKRelaySet.fromRelayUrls([...userRelays, ...SEARCH_RELAYS], ndk),
  );
  console.log(
    "published submit event to",
    [...r].map((r) => r.url),
  );
  if (!r.size) throw new Error("Failed to publish to relays");

  // update cache
  let submitted = submitsCache.get(site.id) || [];

  // remove from submitted
  submitted = submitted.filter((s) => s.id !== id);
  if (!remove) {
    // add back with current user as submitter
    submitted.push(post);
  }

  console.log("submitted", submitted);
  submitsCache.set(site.id, submitted);

  return post;
}
