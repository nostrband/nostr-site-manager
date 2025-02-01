"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledWrapChildren = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: 348,
  margin: "0 auto",
  alignItems: "center",
}));
