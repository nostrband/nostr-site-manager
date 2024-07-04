"use client";
import { Suspense } from "react";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ListSites } from "@/components/ListSites";
import { Button, Typography } from "@mui/material";

export default function Home() {
  const { data, isLoading, isFetching } = useListSites();

  const logout = () => {
    document.dispatchEvent(new Event("nlLogout"));
    window.location.reload();
  };

  return (
    <Suspense>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Your websites
        <Button onClick={logout}>Logout</Button>
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
