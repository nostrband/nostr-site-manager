"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledWrapPage = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  height: "calc(100% - 50px)",
}));

export const StyledCardHead = styled(Box)(() => ({
  display: "flex",
  gap: "inherit",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
}));

export const StyledCardIcon = styled(Box)(() => ({
  fontSize: 35,
  display: "inline-flex",
}));
