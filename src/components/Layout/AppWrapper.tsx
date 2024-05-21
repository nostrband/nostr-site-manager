"use client";
import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
});

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <BodyWrapper>
      <SnackbarProvider>{children}</SnackbarProvider>
    </BodyWrapper>
  );
};
