import { NDKEvent } from "@nostr-dev-kit/ndk";
import { getSiteSettings, nostrParser } from "./api";
import { SEARCH_RELAYS, ndk } from "./nostr";
import {
  fetchEvents,
  createSiteFilters,
  matchPostsToFilters,
  Post,
} from "libnostrsite";

export async function searchEvents(
  siteId: string,
  {
    authors,
    kinds,
    hashtags,
    since,
    until,
    search,
  }: {
    authors?: string[];
    kinds?: number[];
    hashtags?: string[];
    since?: number;
    until?: number;
    search?: string;
  }
): Promise<Post[]> {
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
  const posts = [];
  for (const e of valid) {
    const post = await nostrParser.parseEvent(e);
    if (!post) continue;
    
    // FIXME wtf? move to libnostrsite
    const hashtags = nostrParser.parseHashtags(e);
    // @ts-ignore
    post.tags = hashtags.map(t => ({
      id: t.toLocaleLowerCase(),
      name: t,
    }));

    posts.push(post);
  }

  return posts;
}
