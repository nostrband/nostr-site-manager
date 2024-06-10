import { NostrEvent } from "@nostr-dev-kit/ndk";
import { fetchSites } from "./nostr/api";

export type ReturnSitesDataType = {
  id: string;
  name: string;
  title: string;
  icon: string;
  description: string;
  url: string;
};

export type ReturnSettingsSiteDataType = {
  id: string;
  name: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  logo: string;
  image: string;
  timezone: {
    name: string;
    label: string;
  };
  language: string;
  metaDescription: string;
  metaTitle: string;
  ogDescription: string;
  ogTitle: string;
  ogImage: string;
  xTitle: string;
  xImage: string;
  xDescription: string;
  fTitle: string;
  fDescription: string;
  socialAccountFaceBook: string;
  socialAccountX: string;
  isPrivate: boolean;
  password: string;

  event?: NostrEvent;

  navigation: {
    primary: { title: string; link: string; id: number }[];
    secondary: { title: string; link: string; id: number }[];
  };
};

export const getSites = async (): Promise<ReturnSitesDataType[]> => {
  try {
    return await fetchSites();
    // const res: AxiosResponse<any> = await ApiClient.get("/sites");

    // return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSettingsSite = async (
  id: string,
): Promise<ReturnSettingsSiteDataType> => {
  try {
    const site = (await fetchSites()).find((s) => s.id === id)!;
    console.log("site", site);

    const formatTestData = {
      ...site,
      navigation: {
        primary: [{ title: "About", link: "/about", id: Date.now() }],
        secondary: [{ title: "Login", link: "/login", id: Date.now() }],
      },
    };

    return formatTestData;
    // const res: AxiosResponse<any> = await ApiClient.get(
    //   `/settings-site?id=${id}`,
    // );

    // return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
