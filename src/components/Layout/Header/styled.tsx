"use client";
import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { AppBar, AppBarProps, Box, Toolbar } from "@mui/material";
import { SIDEBAR_WIDTH } from "@/consts";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

interface IAppBar {
  isDesktop?: boolean;
  isHideSideBar?: boolean;
}

export type IStyledAppBar = IAppBar & AppBarProps;

export const StyledAppBar = styled(
  forwardRef<HTMLAnchorElement, IStyledAppBar>(
    function MainContentName(props, ref) {
      const exclude = new Set(["isDesktop", "isHideSideBar"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <AppBar component="nav" ref={ref} {...omitProps} />;
    },
  ),
)(({ isHideSideBar, theme }) => ({
  width: `calc(100% - ${isHideSideBar ? SIDEBAR_WIDTH : 0}px)`,
  left: 0,
  [theme.breakpoints.down("lg")]: {
    width: "100%",
  },
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

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    display: "none",
  },
}));
