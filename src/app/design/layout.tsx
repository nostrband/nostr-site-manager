export const metadata = {
  title: "Nostr Blog | Design",
  description: "App for managment your site",
};

export default async function DesignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
