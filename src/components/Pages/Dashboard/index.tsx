"use client";
import { Button, Typography } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useParams } from "next/navigation";
import { TitleAdmin } from "@/components/TitleAdmin";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React from "react";

export const Dashboard = () => {
  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getSite = data?.find((el) => el.id === siteId);

  if (isLoading || isFetching) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <>
      <TitleAdmin>Dashboard</TitleAdmin>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        {getSite?.title}
      </Typography>
      <Button
        size="small"
        variant="outlined"
        color="decorate"
        href={getSite?.url}
      >
        Open website
      </Button>
    </>
  );
};
