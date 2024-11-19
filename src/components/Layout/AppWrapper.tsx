"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import Script from "next/script";
import { AuthContext, onAuth } from "@/services/nostr/nostr";
import { BodyWrapper } from "./MainContent";

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState({
    isAuth: false,
    isLoading: true,
  });

  useEffect(() => {
    setAuthed((prev) => ({
      ...prev,
      isLoading: localStorage.getItem("localUserPubkey") ? true : false,
    }));

    document.addEventListener("nlAuth", async (e: any) => {
      setAuthed((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const getAuth = await onAuth(e);

        setAuthed({
          isAuth: getAuth,
          isLoading: false,
        });
      } catch (err) {
        setAuthed({
          isAuth: false,
          isLoading: false,
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={authed}>
      <BodyWrapper>
        <Script
          data-perms="sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514,sign_event:27235,sign_event:5,sign_event:30516"
          data-no-banner="true"
          data-otp-request-url="https://api.npubpro.com/otp"
          data-otp-reply-url="https://api.npubpro.com/authotp"
          //          src="https://www.unpkg.com/nostr-login@latest/dist/unpkg.js"
          src="/nostr-login.js"
        />
        <Script
          defer
          data-domain="npub.pro"
          src="https://plausible.io/js/script.js"
        ></Script>
        <SnackbarProvider>{children}</SnackbarProvider>
      </BodyWrapper>
    </AuthContext.Provider>
  );
};
