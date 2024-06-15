"use client";
import { ReactNode, useEffect } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";
import Script from "next/script";

export let authed = false;

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
});

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    document.addEventListener("nlAuth", (e: any) => {
      console.log("nlAuth", e);
      authed = e.detail.type !== "logout";
    });
  }, []);

  return (
    <BodyWrapper>
      <SnackbarProvider>{children}</SnackbarProvider>
      <Script
        data-perms="sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514"
        src="https://www.unpkg.com/nostr-login@latest/dist/unpkg.js"
      />
    </BodyWrapper>
  );
};
