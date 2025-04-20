"use client";
import Link from "next/link";
import { Button, Container, Tab } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage, StyledWrap } from "@/components/shared/styled";
import { useState } from "react";
import { TabContext, TabList } from "@mui/lab";
import { StyledTabPanel, StyledWrapColumn } from "./styled";
import { PaymentItem } from "./PaymentItem";
import { PaidInvoicesItem } from "./PaidInvoicesItem";
import { PendingInvoices } from "./PendingInvoices";
import { useOrders } from "@/hooks/useOrders";
import { useInvoices } from "@/hooks/useInvoices";
import { useListSites } from "@/hooks/useListSites";
import { useServices } from "@/hooks/useServices";

const BillingDetails = () => {
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
  } = useInvoices();

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

  const [tabKey, setTabKey] = useState<
    "pending-invoices" | "paid-invoices" | "payments"
  >("payments");

  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: "pending-invoices" | "paid-invoices" | "payments",
  ) => {
    setTabKey(newValue);
  };

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
    <Container maxWidth="lg">
      <StyledWrap>
        <StyledTitlePage>
          <Button
            LinkComponent={Link}
            href="/admin"
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Billing details
        </StyledTitlePage>

        <TabContext value={tabKey}>
          <TabList
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons={false}
            aria-label="scrollable prevent tabs example"
          >
            <Tab label="Pending invoices" value="pending-invoices" />
            <Tab label="Paid invoices" value="paid-invoices" />
            <Tab label="Payments" value="payments" />
          </TabList>

          <StyledTabPanel value="pending-invoices">
            <PendingInvoices />
          </StyledTabPanel>

          <StyledTabPanel value="paid-invoices">
            <StyledWrapColumn>
              <PaidInvoicesItem />
              <PaidInvoicesItem />
              <PaidInvoicesItem />
            </StyledWrapColumn>
          </StyledTabPanel>

          <StyledTabPanel value="payments">
            <StyledWrapColumn>
              {paymentsItems.map((el, i) => {
                return <PaymentItem paymentInfo={el} key={i} />;
              })}
            </StyledWrapColumn>
          </StyledTabPanel>
        </TabContext>
      </StyledWrap>
    </Container>
  );
};

export default BillingDetails;
