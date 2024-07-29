"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledEmptyBlock = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexDirection: "column",
}));

export const StyledEmptyIcon = styled(Box)(() => ({
  fontSize: 40,
  lineHeight: "40px",
}));

export const SpinerWrapSites = styled(Box)(() => ({
  display: "flex",
}));
