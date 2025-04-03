"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledPaymentItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

export const StyledAmountWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  maxWidth: 160,
  width: "100%",
  alignItems: "start",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

export const StyledDate = styled(Box)(() => ({
  maxWidth: 196,
  width: "100%",
  padding: "8px 16px",
}));

export const StyledPaymentInvoice = styled(Box)(({ theme }) => ({
  maxWidth: 300,
  width: "100%",
  alignItems: "end",
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    justifyContent: "space-between",
  },
}));

export const StyledPaymentInvoiceInfo = styled(Box)(() => ({
  padding: "8px 16px",
}));

export const StyledPaymentInvoicePrice = styled(Box)(() => ({
  maxWidth: 82,
  width: "100%",
  padding: "8px 16px",
}));
