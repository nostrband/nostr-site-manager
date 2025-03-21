"use client";
import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, AppBarProps, Toolbar } from "@mui/material";

export const StyledAppBar = styled(
  forwardRef<HTMLAnchorElement, AppBarProps>(function AppBarName(props, ref) {
    return <AppBar component="nav" ref={ref} {...props} />;
  }),
)(({ theme }) => ({
  width: "100%",
  boxShadow: theme.shadows[5],
  zIndex: 1299,
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minHeight: "50px",
  height: "50px",
  left: 0,
  gap: 8,
  [theme.breakpoints.up("sm")]: {
    minHeight: "50px",
    height: "50px",
  },
  a: {
    textDecoration: "none",
  },
}));
