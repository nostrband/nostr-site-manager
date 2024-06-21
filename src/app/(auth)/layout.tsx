import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout";

export const metadata = {
  title: "Npub.pro",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
