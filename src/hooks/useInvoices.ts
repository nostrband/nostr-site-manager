import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "@/services/billing.service";

type InvoiceParams = {
  paid: boolean;
};

type InvoiceOptions = {
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
};

export const useInvoices = (
  params?: InvoiceParams,
  options?: InvoiceOptions,
) => {
  return useQuery({
    queryKey: ["billing-invoices", params?.paid],
    queryFn: () => getInvoices(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};
