"use client";
import React from "react";
import { Slide, useScrollTrigger } from "@mui/material";
import { StyledAppBar, StyledToolbar } from "./styled";

interface PropsHeader {
  window?: () => Window;
  children?: React.ReactNode;
}

function HideOnScroll({ children, window }: PropsHeader) {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {React.isValidElement(children) ? children : <div />}
    </Slide>
  );
}

export const Header: React.FC<PropsHeader> = ({ children, ...props }) => {
  return (
    <>
      <HideOnScroll {...props}>
        <StyledAppBar>
          <StyledToolbar>{children}</StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>
      <StyledToolbar />
    </>
  );
};
