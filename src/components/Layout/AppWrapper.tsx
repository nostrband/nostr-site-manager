"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";
import Script from "next/script";
import { AuthContext, onAuth } from "@/services/nostr/nostr";

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
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
          src="https://www.unpkg.com/nostr-login@latest/dist/unpkg.js"
        />
      </BodyWrapper>
    </AuthContext.Provider>
  );
};
