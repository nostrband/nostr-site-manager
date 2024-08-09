"use client";
import { Suspense } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";
import { Container, Typography } from "@mui/material";
import { GetStarted } from "@/components/GetStarted";

export default function Home() {
  const { data, isLoading, isFetching } = useListSites();

  return (
    <Suspense>
      {isLoading || isFetching ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <Container sx={{ height: "100%" }} maxWidth="lg" disableGutters>
          {data?.length ? <ListSites data={data || []} /> : <GetStarted />}
        </Container>
      )}
    </Suspense>
  );
}
