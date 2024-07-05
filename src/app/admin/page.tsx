"use client";
import { Suspense } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";
import { Container, Typography } from "@mui/material";

export default function Home() {
  const { data, isLoading, isFetching } = useListSites();

  return (
    <Suspense>
      {isLoading || isFetching ? (
        <SpinerWrap>
          <SpinerCircularProgress />
        </SpinerWrap>
      ) : (
        <Container maxWidth="lg" disableGutters>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", paddingTop: "10px" }}
          >
            Your websites
          </Typography>
          <ListSites data={data || []} />
        </Container>
      )}
    </Suspense>
  );
}
