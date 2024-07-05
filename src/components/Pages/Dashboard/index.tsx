"use client";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useParams } from "next/navigation";
import { TitleAdmin } from "@/components/TitleAdmin";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React from "react";
import Avatar from "@mui/material/Avatar";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";

export const Dashboard = () => {
  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getSite = data?.find((el) => el.id === siteId);

  const switchTheme = () => {
    window.open(`/preview?siteId=${siteId}&themeId=${getSite?.themeId}`);
  };

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
      <Card elevation={0} sx={{ maxWidth: "600px" }}>
        <CardHeader title={<b>{getSite?.title}</b>} sx={{ paddingLeft: 0 }} />

        {Boolean(getSite?.image) ? (
          <CardMedia
            component="img"
            height="300"
            image={getSite?.image}
            alt={getSite?.name}
            sx={{ borderRadius: "15px" }}
          />
        ) : (
          <Box
            sx={{
              background: "#ececec",
              display: "flex",
              height: "300px",
              width: "100%",
              borderRadius: "15px",
            }}
          >
            <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
          </Box>
        )}
        <CardContent sx={{ paddingLeft: 0 }}>
          <Typography variant="body2">{getSite?.description}</Typography>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", gap: "10px" }}>
        <Button
          size="small"
          variant="outlined"
          color="decorate"
          href={getSite?.url}
        >
          Open website
        </Button>

        <Button
          size="small"
          variant="outlined"
          color="decorate"
          onClick={switchTheme}
        >
          Change theme
        </Button>
      </Box>
    </>
  );
};
