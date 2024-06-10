"use client";
import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";

interface IBox {
  isDesktop?: boolean;
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
  padding: 32,
  paddingTop: isDesktop ? 32 : 64,
}));
