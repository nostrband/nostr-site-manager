export const addHttps = (url: string): string => {
  if (!url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};
