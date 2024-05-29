import { useQuery } from "@tanstack/react-query";
import { getSites } from "@/services/sites.service";

// Hydrated fetch with disabled refetchOnMount as data should be present through hydration
export const useListSites = () => {
  return useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
