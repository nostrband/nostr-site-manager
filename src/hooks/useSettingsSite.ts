import { useQuery } from "@tanstack/react-query";
import { getSettingsSite } from "@/services/sites.service";

// Hydrated fetch with disabled refetchOnMount as data should be present through hydration
export const useSettingsSite = (id: string) => {
  return useQuery({
    queryKey: ["settings-site", id],
    queryFn: () => getSettingsSite(id),
    refetchOnWindowFocus: false,
  });
};
