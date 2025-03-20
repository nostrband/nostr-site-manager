import { ReactNode } from "react";
import { ThemeWrapper } from "@/mui/ThemeWrapper";
import Providers from "@/utils/tanstack/providers.client";
import dynamic from "next/dynamic";
import { BodyWrapper } from "@/components/Layout/MainContent";
import Script from "next/script";

const AppWrapper = dynamic(() => import("../components/Layout/AppWrapper"), {
  ssr: false,
});

export const metadata = {
  title: "Npub.pro",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      style={{
        height: "100%",
        scrollBehavior: "smooth",
        scrollPaddingTop: "48px",
      }}
    >
      <ThemeWrapper>
        <Providers>
          <BodyWrapper>
            <Script
              data-perms="sign_event:30512,sign_event:512,sign_event:30513,sign_event:30514,sign_event:27235,sign_event:5,sign_event:30516,sign_event:30517,sign_event:30518"
              data-no-banner="true"
              data-otp-request-url="https://api.npubpro.com/otp"
              data-otp-reply-url="https://api.npubpro.com/authotp"
              src="https://www.unpkg.com/nostr-login@latest/dist/unpkg.js"
              // src="/nostr-login.js"
            />
            <Script
              defer
              data-domain="npub.pro"
              src="https://plausible.io/js/script.js"
            ></Script>
            <AppWrapper>{children}</AppWrapper>
          </BodyWrapper>
        </Providers>
      </ThemeWrapper>
    </html>
  );
}
