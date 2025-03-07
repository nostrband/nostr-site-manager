"use client";
import { styled } from "@mui/material/styles";
import { StyledTitlePage } from "@/components/shared/styled";
import { Box, Typography } from "@mui/material";

export const StyledTitleStartPage = styled(StyledTitlePage)(() => ({
  paddingBottom: 0,
}));

export const StyledWrapBlock = styled(Box)(({ theme }) => ({
  paddingBottom: 0,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  padding: 16,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledWrapChip = styled(Box)(() => ({
  padding: "0px 8px",
}));

export const StyledTitle = styled(Typography)(() => ({
  fontSize: 20,
  lineHeight: "26px",
  fontWeight: "bold",
}));
