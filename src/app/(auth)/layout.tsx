import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout";

export const metadata = {
  title: "Nostr Blog Admin",
  description: "App for managment your blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
