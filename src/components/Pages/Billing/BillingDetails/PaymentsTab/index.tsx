import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { PaymentItem } from "../PaymentItem";
import { StyledWrapColumn } from "../styled";
import { useListSites } from "@/hooks/useListSites";
import { useOrders } from "@/hooks/useOrders";
import { useInvoices } from "@/hooks/useInvoices";
import { useServices } from "@/hooks/useServices";

export const PaymentsTab = () => {
  const { data: dataSites, isLoading, isFetching } = useListSites();
  const {
    data: dataOrders,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
  } = useOrders();

  const {
    data: dataInvoices,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useInvoices(
    { paid: true },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const {
    data: dataServices,
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
  } = useServices();

  const paymentsItems =
    dataOrders && dataInvoices && dataSites && dataServices
      ? dataOrders.map((orderItem) => {
          const invoices = dataInvoices.filter(
            (invoice) => invoice.id === orderItem.invoice_ids,
          );
          return {
            order: orderItem,
            invoices: invoices.map((invoice) => {
              const service = dataServices.find(
                (el) => el.id === invoice.service_id,
              );
              const siteInfo = dataSites.find(
                (site) => site.id === service?.object_id,
              );

              return {
                invoice,
                siteInfo,
              };
            }),
          };
        })
      : [];

  if (
    isFetchingServices ||
    isLoadingServices ||
    isLoading ||
    isFetching ||
    isLoadingOrders ||
    isFetchingOrders ||
    isFetchingInvoices ||
    isLoadingInvoices
  ) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <StyledWrapColumn>
      {paymentsItems.map((el, i) => {
        return <PaymentItem paymentInfo={el} key={i} />;
      })}
    </StyledWrapColumn>
  );
};
