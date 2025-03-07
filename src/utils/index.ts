import { fetchProfiles } from "@/services/nostr/api";
import { parseProfileEvent } from "@/services/nostr/nostr";
import { LevelNavigation } from "@/services/sites.service";
import { TypeAuthor } from "@/types";
import { InputNavigation, InputNavigationReset } from "@/types/setting.types";

export const addHttps = (url: string): string => {
  if (!url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const updateLevelNavigation = (
  level: LevelNavigation,
  input: InputNavigation
) => {
  const navigation = level.map((item) => {
    if (item.id === input.id) {
      return {
        ...item,
        [input.field]: input.value,
      };
    }

    return item;
  });

  return navigation;
};

export const resetLevelNavigation = (
  level: LevelNavigation,
  input: InputNavigationReset
) => {
  const navigation = level.map((item) => {
    if (item.id === input.id) {
      return {
        ...item,
        title: input.fields.title,
        link: input.fields.link,
      };
    }

    return item;
  });

  return navigation;
};

export const getRecomendAuthors = async (
  authors: TypeAuthor[],
  callback: (authors: TypeAuthor[]) => void
) => {
  try {
    const pubkeys = authors.map((u) => u.pubkey);
    const profiles = await fetchProfiles(pubkeys);

    if (!profiles || profiles.length === 0) return;

    const updatedAuthors = authors.map((u) => {
      const profile = profiles.find((p) => p.pubkey === u.pubkey);
      if (!profile) return u;
      const { name, img, about } = parseProfileEvent(u.pubkey, profile);
      return { ...u, name, img, about };
    });

    callback(updatedAuthors);
  } catch (error) {
    console.error("Failed to load profiles:", error);
  }
};

export const getLinksMenu = (siteId: string, themeId?: string) => {
  const linkToDashboard = `/admin/${siteId}/dashboard`;
  const linkSwitchTheme = `/design?siteId=${siteId}&themeId=${themeId}`;
  const linkSettings = `/admin/${siteId}/settings`;
  const linkPostManagement = `/admin/${siteId}/posts`;

  return {
    linkToDashboard,
    linkSwitchTheme,
    linkSettings,
    linkPostManagement,
  };
};
