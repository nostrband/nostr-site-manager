"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";
import Script from "next/script";
import { AuthContext, onAuth } from "@/services/nostr/nostr";

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
  color: "initial",
});

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    document.addEventListener("nlAuth", async (e: any) => {
      setAuthed(await onAuth(e));
    });
  }, []);

  return (
    <AuthContext.Provider value={authed}>
      <BodyWrapper>
        <SnackbarProvider>{children}</SnackbarProvider>
        <Script
          data-perms="sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514,sign_event:27235"
          data-no-banner="true"
          data-methods="connect,extension,otp"
          data-otp-request-url="https://api.npubpro.com/otp"
          data-otp-reply-url="https://api.npubpro.com/authotp"
          src="https://www.unpkg.com/nostr-login@latest/dist/unpkg.js"
        />
        <script defer data-domain="npub.pro" src="https://plausible.io/js/script.js"></script>
      </BodyWrapper>
    </AuthContext.Provider>
  );
};
