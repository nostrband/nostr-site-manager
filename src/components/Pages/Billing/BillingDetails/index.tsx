"use client";
import Link from "next/link";
import { Button, Container, Tab } from "@mui/material";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage, StyledWrap } from "@/components/shared/styled";
import { useState } from "react";
import { TabContext, TabList } from "@mui/lab";
import { StyledTabPanel } from "./styled";
import { PendingInvoicesTab } from "./PendingInvoicesTab";
import { PaymentsTab } from "./PaymentsTab";
import { PaidInvoicesTab } from "./PaidInvoicesTab";

const BillingDetails = () => {
  const [tabKey, setTabKey] = useState<
    "pending-invoices" | "paid-invoices" | "payments"
  >("pending-invoices");

  const handleChangeTab = (
    _: React.SyntheticEvent,
    newValue: "pending-invoices" | "paid-invoices" | "payments",
  ) => {
    setTabKey(newValue);
  };

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
            <PendingInvoicesTab />
          </StyledTabPanel>

          <StyledTabPanel value="paid-invoices">
            <PaidInvoicesTab />
          </StyledTabPanel>

          <StyledTabPanel value="payments">
            <PaymentsTab />
          </StyledTabPanel>
        </TabContext>
      </StyledWrap>
    </Container>
  );
};

export default BillingDetails;
