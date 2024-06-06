import { SideBarNav } from "@/components/Layout/SideBarNav";
import { MainWrapper } from "@/components/Layout/MainWrapper";
import { MainContent } from "@/components/Layout/MainContent";
import { PageWrapper } from "@/components/Layout/PageWrapper";

export const metadata = {
  title: "Nostr Blog Admin | Admin",
  description: "App for managment your blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainWrapper>
      <SideBarNav />
      <MainContent>
        <PageWrapper>{children}</PageWrapper>
      </MainContent>
    </MainWrapper>
  );
}
