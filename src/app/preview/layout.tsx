export const metadata = {
  title: "Nostr Blog | Preview",
  description: "App for managment your site",
};

export default async function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
