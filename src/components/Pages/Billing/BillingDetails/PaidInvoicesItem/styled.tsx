"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledAmountWrap = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  width: "100%",
  alignItems: "center",
}));

export const StyledFeature = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  alignItems: "end",
}));

export const StyledPaidInvoicesHead = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 4,
}));

export const StyledFeatureList = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
}));
