import { ReactNode } from "react";
import { ThemeWrapper } from "@/mui/ThemeWrapper";
import Providers from "@/utils/tanstack/providers.client";
import dynamic from "next/dynamic";

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
          <AppWrapper>{children}</AppWrapper>
        </Providers>
      </ThemeWrapper>
    </html>
  );
}
