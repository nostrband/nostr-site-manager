import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/services/billing.service";

export const useInvoices = () => {
  return useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => getInvoices(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
