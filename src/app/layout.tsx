import { ReactNode } from "react";
import { ThemeWrapper } from "@/mui/ThemeWrapper";
import { AppWrapper } from "@/components/Layout/AppWrapper";
import Providers from "@/utils/tanstack/providers.client";

export const metadata = {
  title: "Npub.pro",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
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
