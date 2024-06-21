"use client";
import { Suspense } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";
import { Typography } from "@mui/material";

export default function Home() {
  const { data, isLoading, isFetching } = useListSites();

  return (
    <Suspense>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Your websites
      </Typography>

      {isLoading || isFetching ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <ListSites data={data || []} />
      )}
    </Suspense>
  );
}
