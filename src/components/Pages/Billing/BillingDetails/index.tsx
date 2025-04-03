"use client";
import Link from "next/link";
import { Button, Container, Tab } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { StyledTitlePage, StyledWrap } from "@/components/shared/styled";
import { useState } from "react";
import { TabContext, TabList } from "@mui/lab";
import { StyledTabPanel, StyledWrapColumn } from "./styled";
import { PaymentItem } from "./PaymentItem";
import { PaidInvoicesItem } from "./PaidInvoicesItem";
import { PendingInvoices } from "./PendingInvoices";

const BillingDetails = () => {
  const { data, isLoading, isFetching } = useListSites();
  const { siteId } = useGetSiteId();
  const getSite = data?.find((el) => el.id === siteId);
  console.log({ getSite });

  const [tabKey, setTabKey] = useState<
    "pending-invoices" | "paid-invoices" | "payments"
  >("pending-invoices");

  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: "pending-invoices" | "paid-invoices" | "payments",
  ) => {
    setTabKey(newValue);
  };

  if (isLoading || isFetching) {
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
              <PaymentItem />
              <PaymentItem />
              <PaymentItem />
            </StyledWrapColumn>
          </StyledTabPanel>
        </TabContext>
      </StyledWrap>
    </Container>
  );
};

export default BillingDetails;
