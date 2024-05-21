import { ReactNode } from "react";
import { ThemeWrapper } from "@/mui/ThemeWrapper";
import { AppWrapper } from "@/components/Layout/AppWrapper";

export const metadata = {
  title: "Nostr Blog Admin",
  description: "App for managment your blog",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" style={{ height: "100%" }}>
      <ThemeWrapper>
        <AppWrapper>{children}</AppWrapper>
      </ThemeWrapper>
    </html>
  );
}
