import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/services/billing.service";

export const useServices = () => {
  return useQuery({
    queryKey: ["billing-services"],
    queryFn: () => getServices(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
