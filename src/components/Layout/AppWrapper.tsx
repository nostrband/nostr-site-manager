"use client";
import { ReactNode } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";

import { initNostrLogin } from "@/modules/auth/nostr-login";

initNostrLogin();

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
