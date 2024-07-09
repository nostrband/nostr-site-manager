"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useParams, useRouter } from "next/navigation";
import { TitleAdmin } from "@/components/TitleAdmin";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React from "react";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import {
  StyledCardHeader,
  StyledWrapFooter,
} from "@/components/ListSites/styled";
import {
  StyledCardNoImage,
} from "@/components/Pages/Dashboard/styled";
import Avatar from "@mui/material/Avatar";
import { getContrastingTextColor } from "@/utils/contrasting-color";

export const Dashboard = () => {
  const router = useRouter();
  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getSite = data?.find((el) => el.id === siteId);

  const switchTheme = () => {
    router.push(`/design?siteId=${siteId}&themeId=${getSite?.themeId}`);
  };

  const openSettings = () => {
    router.push(`/admin/${siteId}/settings`);
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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Card sx={{ maxWidth: "400px" }}>
          <StyledCardHeader
            avatar={
              <Avatar variant="square" src={getSite?.logo}>
                {getSite?.name}
              </Avatar>
            }
            title={<b>{getSite?.title}</b>}
            subheader={<Box>{getSite?.url}</Box>}
          />
          {Boolean(getSite?.image) ? (
            <CardMedia
              component="img"
              height="250"
              image={getSite?.image}
              alt={getSite?.name}
            />
          ) : (
            <StyledCardNoImage>
              <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
            </StyledCardNoImage>
          )}
          <StyledWrapFooter sx={{ background: `${getSite?.accentColor}` }}>
            <CardContent>
              <Typography
                variant="body2"
                color={getContrastingTextColor(getSite?.accentColor)}
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                  wordWrap: "break-word",
                }}
              >
                {getSite?.description}
              </Typography>
            </CardContent>
            <CardHeader
              sx={{ marginTop: "auto" }}
              avatar={
                <Avatar src={getSite?.icon}>{getSite?.contributors[0]}</Avatar>
              }
              title={
                <Box
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "140px",
                    color: getContrastingTextColor(getSite?.accentColor),
                  }}
                >
                  <b>{getSite?.name || getSite?.contributors[0]}</b>
                </Box>
              }
            />
          </StyledWrapFooter>
        </Card>

        <Box
          sx={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
            Theme settings
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="decorate"
            onClick={openSettings}
          >
            Settings
          </Button>
        </Box>
      </Box>
    </>
  );
};
