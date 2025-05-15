"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { StyledCard } from "@/components/shared/styled";

export const StyledAmountWrap = styled(Box)(() => ({
  display: "flex",
  gap: 8,
  width: "100%",
  alignItems: "center",
}));

export const StyledTotalAmount = styled(Box)(() => ({
  marginLeft: "auto",
}));

export const StyledFeature = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
  alignItems: "end",
}));

export const StyledWrap = styled(StyledCard)(() => ({
  cursor: "pointer",
}));

export const StyledPendingInvoicesHead = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 4,
}));

export const StyledFeatureList = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
}));
