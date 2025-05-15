import { Alert, Box, Button, Grid } from "@mui/material";
import { PendingInvoicesItem } from "../PendingInvoicesItem";
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { StyledStikyWrap } from "../styled";
import { useListSites } from "@/hooks/useListSites";
import { useInvoices } from "@/hooks/useInvoices";
import { useServices } from "@/hooks/useServices";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useState } from "react";
import {
  createOrder,
  // createTestInvoice,
  ReturnInvoiceType,
} from "@/services/billing.service";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";
import { StyledCardActionArea } from "../../styled";
import { EmptyBlock } from "@/components/EmptyBlock";
import { EmptyBillingTwoToneIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";

export const PendingInvoicesTab = () => {
  const router = useRouter();
  const { data: dataSites, isLoading, isFetching } = useListSites();
  const [listChoiceInvoices, setListChoiceInvoices] = useState<
    ReturnInvoiceType[]
  >([]);

  const [isLoadingPay, setLoadingPay] = useState(false);

  const totalAmount = listChoiceInvoices.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  const { currencies } = useConvertCurrency(totalAmount);

  const { usd, sats } = currencies;

  const {
    data: dataInvoices,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useInvoices(
    { paid: false },
    { refetchOnMount: true, refetchOnWindowFocus: true },
  );

  const {
    data: dataServices,
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
  } = useServices();

  const handleChoice = (invoice: ReturnInvoiceType) => {
    setListChoiceInvoices((prevSelected) => {
      if (prevSelected.some((selected) => selected.id === invoice.id)) {
        return prevSelected.filter((selected) => selected.id !== invoice.id);
      }

      return [...prevSelected, invoice];
    });
  };

  const isItemSelected = (invoice: ReturnInvoiceType) => {
    return listChoiceInvoices.some((selected) => selected.id === invoice.id);
  };

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
            isSelected: isItemSelected(invoice),
          };
        })
      : [];

  const isEmptyInvoices = invoicesItems.length === 0;
  const handlePay = async () => {
    setLoadingPay(true);
    try {
      const invoiceIds = listChoiceInvoices.map((el) => el.id);

      const order = await createOrder(invoiceIds);

      router.push(
        `/admin/order?orderId=${order.id}&checkoutUrl=${order.checkout_url}`,
      );
    } catch (error) {
      console.error(error);

      setLoadingPay(false);
    }
  };

  // const handleTest = async () => {
  //   await createTestInvoice('5004fa45-cc6d-4b96-9648-ee47f0586f04')
  // }

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
    <>
      <Grid container spacing={{ xs: "24px" }} columns={{ xs: 12, sm: 12 }}>
        {/* <button onClick={handleTest}>test</button> */}
        {!isEmptyInvoices && (
          <Grid item xs={12}>
            <Alert severity="warning">
              Your subscription expires in 5 days, please pay up
            </Alert>
          </Grid>
        )}
        {isEmptyInvoices ? (
          <Grid item xs={12}>
            <EmptyBlock
              text="Empty pending invoices"
              icon={EmptyBillingTwoToneIcon}
            />
          </Grid>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={6}>
              <Box>
                <Grid
                  container
                  spacing={{ xs: "24px" }}
                  columns={{ xs: 12, sm: 12 }}
                >
                  {invoicesItems.map((el, i) => {
                    return (
                      <Grid key={i} item xs={12}>
                        <StyledCardActionArea
                          onClick={() => handleChoice(el.invoice)}
                        >
                          <PendingInvoicesItem invoiceInfo={el} />
                        </StyledCardActionArea>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <StyledStikyWrap>
                <TotalAmountDescription description="total PAYMENT">
                  <TotalAmount size="small" usd={usd} sats={sats} />
                </TotalAmountDescription>
                <Button
                  disabled={listChoiceInvoices.length === 0 || isLoadingPay}
                  loading={isLoadingPay}
                  fullWidth
                  size="large"
                  variant="contained"
                  onClick={handlePay}
                >
                  Pay Now
                </Button>
              </StyledStikyWrap>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};
