"use client";
import { styled } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";

export const StyledWrapActions = styled(Box)(() => ({
  display: "flex",
  gap: 16,
}));

export const StyledWrapper = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 32px",
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  zIndex: 2,
  background: "#fff",
  boxShadow: "0px -1px 16px 0px rgba(0, 0, 0, 0.1)",
}));

export const StyledIconButton = styled(IconButton)(() => ({
  border: "1px solid rgba(233, 233, 233, 1)",
}));
