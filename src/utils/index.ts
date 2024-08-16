import { ReturnSettingsSiteDataType } from "@/services/sites.service";

export const syncContributorsData = (
  idsArray: string[],
  objectsArray: ReturnSettingsSiteDataType["contributors"],
) => {
  const resultArray: ReturnSettingsSiteDataType["contributors"] = [];

  idsArray.forEach((p) => {
    const foundObject = objectsArray.find((obj) => obj.pubkey === p);

    if (foundObject) {
      resultArray.push(foundObject);
    } else {
      resultArray.push({ pubkey: p, hashtags: [], kinds: [] });
    }
  });

  return resultArray;
};
