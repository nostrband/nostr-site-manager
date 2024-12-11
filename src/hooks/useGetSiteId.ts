import { useParams } from "next/navigation";

export const useGetSiteId = () => {
  const params = useParams();

  return { siteId: Array.isArray(params?.id) ? params.id[0] : params?.id}
};
