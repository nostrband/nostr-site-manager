"use client";
import { forwardRef, ReactNode } from "react";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

interface IBox {
  isDesktop?: boolean;
}

interface IBodyWrapper {
  isRedesign?: boolean;
  children: ReactNode;
}

export type IMainContent = IBox & BoxProps;

export const MainContent = styled(
  forwardRef<HTMLAnchorElement, IMainContent>(
    function MainContentName(props, ref) {
      const exclude = new Set(["isDesktop"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <Box ref={ref} {...omitProps} />;
    },
  ),
)(({ isDesktop = false }) => ({
  position: "relative",
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  padding: isDesktop ? 32 : 15,
  paddingTop: isDesktop ? 32 : 64,
}));

export const MainWrapper = styled("div")(() => ({
  position: "relative",
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
}));

export const PageWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  padding: 25,
  background: "#fff",
  position: "relative",
  [theme.breakpoints.down("lg")]: {
    padding: 0,
  },
}));

export const BodyWrapper = styled(
  forwardRef<HTMLBodyElement, IBodyWrapper>(
    function BodyWrapperName(props, ref) {
      const exclude = new Set(["isRedesign"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <body ref={ref} {...omitProps} />;
    },
  ),
)(({ isRedesign = false, theme }) => ({
  height: "100%",
  lineHeight: "initial",
  color: "initial",
  background: isRedesign ? theme.palette.customBackground.light : "initial",
}));
