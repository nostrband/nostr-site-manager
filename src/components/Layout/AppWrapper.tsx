"use client";
import { ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";
import { styled } from "@mui/material/styles";
import Script from "next/script";
import { AuthContext, onAuth, userPubkey } from "@/services/nostr/nostr";

const BodyWrapper = styled("body")({
  height: "100%",
  lineHeight: "initial",
  color: "initial",
});

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState({
    isAuth: false,
    isLoading: true,
  });

  useEffect(() => {
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

  useEffect(() => {
    let counter = 0;

    const interval = setInterval(() => {
      if (userPubkey) {
        clearInterval(interval);

        setAuthed((prev) => ({
          ...prev,
          isLoading: true,
        }));
      } else if (counter >= 3) {
        clearInterval(interval);

        setAuthed({
          isAuth: false,
          isLoading: false,
        });
      }
      counter++;
    }, 1000);

    return () => clearInterval(interval);
  }, [userPubkey]);

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
