"use client";
import Link from "next/link";
import { Box, Button } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useParams, useRouter } from "next/navigation";
import { TitleAdmin } from "@/components/TitleAdmin";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React, { useState } from "react";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";
import { PreviewSite } from "@/components/PreviewSite";

export const Dashboard = () => {
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const router = useRouter();
  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getSite = data?.find((el) => el.id === siteId);

  const switchTheme = `/design?siteId=${siteId}&themeId=${getSite?.themeId}`;

  const openSettings = `/admin/${siteId}/settings`;
  const openContent = `/admin/${siteId}/content`;

  const handeOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handeCloseConfirm = (deleted: boolean) => {
    setOpenConfirm(false);
    if (deleted) router.push(`/admin`);
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
        <Box sx={{ maxWidth: "400px", width: "100%" }}>
          {getSite && (
            <PreviewSite
              icon={getSite.icon}
              logo={getSite.logo}
              name={getSite.name}
              title={getSite.title}
              url={getSite.url}
              image={getSite.image}
              description={getSite.description}
              accentColor={getSite.accentColor}
              contributors={getSite.contributors}
              isLink={false}
              isLinkToOpenSite={false}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            maxWidth: "400px",
            width: "100%",
            gap: "10px",
            flexDirection: "column",
          }}
        >
          {/* @ts-expect-error */}
          <Button
            target="_blank"
            LinkComponent={Link}
            size="medium"
            variant="outlined"
            color="decorate"
            href={getSite?.url}
            fullWidth
          >
            Open website
          </Button>

          <Button
            LinkComponent={Link}
            size="medium"
            variant="outlined"
            color="decorate"
            href={switchTheme}
            fullWidth
          >
            Theme settings
          </Button>

          <Button
            LinkComponent={Link}
            size="medium"
            variant="outlined"
            color="decorate"
            href={openSettings}
            fullWidth
          >
            Settings
          </Button>

          <Button
            LinkComponent={Link}
            size="medium"
            variant="outlined"
            color="decorate"
            href={openContent}
            fullWidth
          >
            Content
          </Button>

          <Button
            size="medium"
            variant="outlined"
            color="error"
            onClick={handeOpenConfirm}
            fullWidth
          >
            Delete
          </Button>
        </Box>
      </Box>
      <ModalConfirmDeleteSite
        isOpen={isOpenConfirm}
        siteId={siteId}
        handleClose={handeCloseConfirm}
      />
    </>
  );
};
