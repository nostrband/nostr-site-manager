import { LevelNavigation } from "@/services/sites.service";
import { InputNavigation, InputNavigationReset } from "@/types/setting.types";

export const addHttps = (url: string): string => {
  if (!url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const updateLevelNavigation = (
  level: LevelNavigation,
  input: InputNavigation,
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
  input: InputNavigationReset,
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
