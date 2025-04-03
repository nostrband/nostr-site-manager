"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography, TypographyProps } from "@mui/material";

export const StyledTotalAmountDescription = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  gap: 8,
}));

export const StyledText = styled(Typography)<TypographyProps>(() => ({
  textTransform: "uppercase",
  letterSpacing: 1,
  maxWidth: 130,
  lineHeight: "200%",
}));
