"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledStatsLoading = styled(Box)(() => ({
  paddingTop: 25,
  paddingBottom: 25,
}));

export const StyledItemStat = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
}));

export const StyledItemStatIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "flex",
}));

export const StyledItemStatValue = styled(Typography)(() => ({
  marginLeft: "auto",
}));
