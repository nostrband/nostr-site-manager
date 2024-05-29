"use client";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";

export default function Home() {
  const { data, isLoading, isFetching } = useListSites();

  return (
    <>
      {isLoading || isFetching ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <ListSites data={data || []} />
      )}
    </>
  );
}
