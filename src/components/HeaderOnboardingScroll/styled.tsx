"use client";
import { styled } from "@mui/material/styles";
import { AppBar, AppBarProps, Box, Container, Toolbar } from "@mui/material";
import { forwardRef } from "react";

interface IAppBar {
  isHide?: boolean;
}

export type IStyledAppBar = IAppBar & AppBarProps;

export const StyledHeaderOnboarding = styled(Box)(() => ({
  position: "relative",
  width: "100%",
  padding: "16px 0",
}));

export const StyledHeaderContainer = styled(Container)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "10px",
}));

export const StyledLogo = styled(Box)(() => ({
  width: "45px",
  display: "flex",
  alignItems: "center",
}));

export const StyledAppBar = styled(
  forwardRef<HTMLAnchorElement, IStyledAppBar>(function AppBarName(props, ref) {
    const exclude = new Set(["isHide"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <AppBar component="nav" ref={ref} {...omitProps} />;
  }),
)(({ isHide, theme }) => ({
  width: "100%",
  left: 0,
  overflow: "hidden",
  top: `${isHide ? "-100px" : "0px"}`,
  transition: "0.3s",
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
}));

export const StyledToolbar = styled(Toolbar)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  left: 0,
  padding: "0 !important",
}));
