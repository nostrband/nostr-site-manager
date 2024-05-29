import { AxiosResponse } from "axios";
import ApiClient from "@/services/core.client";

export type ReturnSitesDataType = {
  id: string;
  title: string;
};

export type ReturnSettingsSiteDataType = {
  id: string;
  title: string;
  description: string;
  timezone: {
    name: string;
    label: string;
  };
  language: string;
  metaDescription: string;
  metaTitle: string;
  xTitle: string;
  xDescription: string;
  fTitle: string;
  fDescription: string;
  socialAccountFaceBook: string;
  socialAccountX: string;
  isPrivate: boolean;
  password: string;
};

export const getSites = async (): Promise<ReturnSitesDataType[]> => {
  try {
    const res: AxiosResponse<any> = await ApiClient.get("/sites");

    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSettingsSite = async (
  id: string,
): Promise<ReturnSettingsSiteDataType> => {
  try {
    const res: AxiosResponse<any> = await ApiClient.get(
      `/settings-site?id=${id}`,
    );

    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};
