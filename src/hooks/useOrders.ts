import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/services/billing.service";

export const useOrders = () => {
  return useQuery({
    queryKey: ["billing-orders"],
    queryFn: () => getOrders(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
