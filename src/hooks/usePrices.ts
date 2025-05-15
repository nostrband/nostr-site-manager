import { useQuery } from "@tanstack/react-query";
import { getPrices } from "@/services/billing.service";

export const usePrices = () => {
  return useQuery({
    queryKey: ["billing-prices"],
    queryFn: () => getPrices(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
