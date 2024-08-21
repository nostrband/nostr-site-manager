import { ContributorType } from "@/services/sites.service";

export const syncContributorsData = (
  idsArray: string[],
  objectsArray: ContributorType[],
) => {
  const resultArray: ContributorType[] = [];

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
