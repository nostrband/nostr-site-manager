"use client";
import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, AppBarProps, Box, Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

export const StyledAppBar = styled(
  forwardRef<HTMLAnchorElement, AppBarProps>(
    function MainContentName(props, ref) {
      return <AppBar component="nav" ref={ref} {...props} />;
    },
  ),
)(() => ({
  width: "100%",
}));

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  minHeight: "50px",
  left: 0,
  [theme.breakpoints.up("sm")]: {
    minHeight: "48px",
  },
}));

export const StyledLogo = styled(Box)(() => ({
  width: "30px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}));

export const StyledUser = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
}));

export const StyledUserAvatar = styled(Avatar)(() => ({
  width: 30,
  height: 30,
}));
