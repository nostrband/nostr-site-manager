"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledItem = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingBottom: "120px",
  padding: 24,
  borderRadius: 32,
  background: "#fff",
}));

export const StyledPlanPrice = styled(Typography)(() => ({
  fontSize: 24,
  fontWeight: "bold",
  fontFamily: InterDisplay.style.fontFamily,
  marginBottom: 8,
}));

export const StyledDescriptionPrice = styled(Typography)(() => ({
  fontSize: 14,
  fontWeight: "400",
  marginBottom: 8,
}));

export const StyledCostPrice = styled(Typography)(() => ({
  fontSize: 48,
  fontWeight: "bold",
  fontFamily: InterDisplay.style.fontFamily,
  marginBottom: 24,
  small: {
    fontSize: 24,
  },
}));

export const StyledFeaturePrice = styled(Box)(() => ({
  display: "flex",
  gap: 12,
}));

export const StyledFeaturePriceGroup = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  marginTop: 24,
}));

export const StyledIconPrice = styled(Box)(() => ({
  width: 16,
}));

export const StyledFeatureDescriptionPrice = styled(Typography)(() => ({
  fontSize: 16,
  lineHeight: "24px",
  fontWeight: "400",
  span: {
    fontWeight: "bold",
  },
}));
