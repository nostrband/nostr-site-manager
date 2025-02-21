"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledWrapDashboard = styled(Box)(() => ({
  maxWidth: "348px",
  width: "100%",
  margin: "0 auto",
}));

export const StyledActions = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "16px",
}));
