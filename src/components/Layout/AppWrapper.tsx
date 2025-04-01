"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import Script from "next/script";
import { AuthContext, onAuth, userPubkey } from "@/services/nostr/nostr";
import { BodyWrapper } from "./MainContent";

let addedHandlers = false;
export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState({
    isAuth: !!userPubkey,
    isLoading: false,
  });

  useEffect(() => {
    if (addedHandlers) return;

    // we're being added 2 times without this check
    addedHandlers = true;
    document.addEventListener("nlAuth", async (e: any) => {
      console.log("nlAuth", e);

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
          data-perms="sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514,sign_event:27235,sign_event:5,sign_event:30516,sign_event:30517,sign_event:30518"
          data-no-banner="true"
          data-otp-request-url="https://api.npubpro.com/otp"
          data-otp-reply-url="https://api.npubpro.com/authotp"
          src="https://cdn.jsdelivr.net/npm/nostr-login@latest/dist/unpkg.min.js"
          // src="/nostr-login.js"
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
