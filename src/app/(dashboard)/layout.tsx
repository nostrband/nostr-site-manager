import { SideBarNav } from "@/components/Layout/SideBarNav";
import { MainWrapper } from "@/components/Layout/MainWrapper";
import { MainContent } from "@/components/Layout/MainContent";
import { PageWrapper } from "@/components/Layout/PageWrapper";
// import getQueryClient from "@/utils/tanstack/getQueryClient";
import Hydrate from "@/utils/tanstack/hydrate.client";
// import { dehydrate } from "@tanstack/query-core";
// import { getSites } from "@/services/sites.service";

export const metadata = {
  title: "Nostr Blog Admin | Admin",
  description: "App for managment your blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["sites", 5],
  //   queryFn: () => getSites(),
  // });

  // const dehydratedState = dehydrate(queryClient);

  return (
    <MainWrapper>
      {/* <Hydrate state={dehydratedState}> */}
        <SideBarNav />
        <MainContent>
          <PageWrapper>{children}</PageWrapper>
        </MainContent>
      {/* </Hydrate> */}
    </MainWrapper>
  );
}
