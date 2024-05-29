import { ReactNode } from "react";
import { ThemeWrapper } from "@/mui/ThemeWrapper";
import { AppWrapper } from "@/components/Layout/AppWrapper";
import Providers from "@/utils/tanstack/providers.client";

export const metadata = {
  title: "Nostr Blog Admin",
  description: "App for managment your blog",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" style={{ height: "100%" }}>
      <ThemeWrapper>
        <Providers>
          <AppWrapper>{children}</AppWrapper>
        </Providers>
      </ThemeWrapper>
    </html>
  );
}
