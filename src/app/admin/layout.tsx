import { DashboardWrapper } from "@/components/Layout/DashboardWrapper";

export const metadata = {
  title: "Admin | Npub.pro",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
