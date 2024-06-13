"use client";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/material";

export const StyledHeaderOnboarding = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  padding: "32px 0",
}));

export const StyledHeaderContainer = styled(Container)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));
