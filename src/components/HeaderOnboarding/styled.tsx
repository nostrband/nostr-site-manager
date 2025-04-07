"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { isMobile } from 'react-device-detect';

export const StyledHeaderOnboarding = styled(Box)(({theme}) => ({
  position: "fixed",
  width: isMobile ? "100%" : "calc(100% - 15px)",
  padding: "12px 80px",
  zIndex: 9999,
  top: 0,
  left: 0,
  background: '#fff',
  boxShadow: theme.shadows[5],
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
  [theme.breakpoints.down("md")]: {
    padding: "12px 15px",
  },
}));

export const StyledHeaderNavigation = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
}));

export const StyledLogo = styled(Box)(() => ({
  width: "46px",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
}));
