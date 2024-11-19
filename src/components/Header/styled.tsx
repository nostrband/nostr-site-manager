"use client";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/material";

export const StyledHeaderOnboarding = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  padding: "7px 0",
  background: "#fff",
  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
}));

export const StyledHeaderContainer = styled(Container)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
}));

export const StyledHeaderNavigation = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));
