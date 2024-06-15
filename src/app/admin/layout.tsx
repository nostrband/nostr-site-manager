import { DashboardWrapper } from "@/components/Layout/DashboardWrapper";

export const metadata = {
  title: "Nostr Blog Admin | Admin",
  description: "App for managment your blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
