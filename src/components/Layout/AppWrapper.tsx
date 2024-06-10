"use client";
import { ReactNode, useEffect } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";

import { initNostrLogin } from "@/modules/auth/nostr-login";

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
});

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    initNostrLogin().then();
  }, []);

  return (
    <BodyWrapper>
      <SnackbarProvider>{children}</SnackbarProvider>
    </BodyWrapper>
  );
};
