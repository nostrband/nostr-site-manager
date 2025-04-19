import { useMemo } from "react";
import { useListSites } from "./useListSites";

interface Site {
  id: string;
  logo?: string;
  name?: string;
  title?: string;
  url?: string;
}

interface SiteInfo {
  siteInfo: {
    logo: string;
    name: string;
    title: string;
    url: string;
  };

  isLoadingBaseInfo: boolean;
}

export const useSiteBaseInfo = (siteId?: string | null): SiteInfo => {
  const { data, isLoading, isFetching } = useListSites();

  const defaultSiteInfo = useMemo(
    () => ({
      logo: "",
      name: "",
      title: "",
      url: "",
    }),
    [],
  );

  const siteInfo = useMemo(() => {
    if (!siteId) return defaultSiteInfo;

    const site = data?.find((el: Site) => el.id === siteId);

    return {
      logo: site?.logo || "",
      name: site?.name || "",
      title: site?.title || "",
      url: site?.url || "",
    };
  }, [data, siteId, defaultSiteInfo]);

  return {
    siteInfo,
    isLoadingBaseInfo: isLoading || isFetching,
  };
};
