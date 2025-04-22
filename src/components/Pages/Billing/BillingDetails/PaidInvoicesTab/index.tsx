import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { StyledWrapColumn } from "../styled";
import { useListSites } from "@/hooks/useListSites";
import { useInvoices } from "@/hooks/useInvoices";
import { useServices } from "@/hooks/useServices";
import { PaidInvoicesItem } from "../PaidInvoicesItem";

export const PaidInvoicesTab = () => {
  const { data: dataSites, isLoading, isFetching } = useListSites();

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

  const invoicesItems =
    dataInvoices && dataSites && dataServices
      ? dataInvoices.map((invoice, i) => {
          const service = dataServices.find(
            (el) => el.id === invoice.service_id,
          );
          const siteInfo = dataSites.find(
            (site) => site.id === service?.object_id,
          );

          return {
            id: i + 1,
            invoice,
            siteInfo,
          };
        })
      : [];

  if (
    isFetchingServices ||
    isLoadingServices ||
    isLoading ||
    isFetching ||
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
      {invoicesItems.map((el, i) => {
        return <PaidInvoicesItem invoiceInfo={el} key={i} />;
      })}
    </StyledWrapColumn>
  );
};
