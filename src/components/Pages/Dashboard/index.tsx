"use client";
import Link from "next/link";
import { Button, Container } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useRouter } from "next/navigation";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React, { useState } from "react";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";

import {
  isNeedMigrateKey,
  migrateToConnectedKey,
} from "@/services/nostr/migrate";
import { useSnackbar } from "notistack";
import { StyledActions, StyledTitle, StyledWrapDashboard } from "./styled";
import {
  ArrowRightIcon,
  BrushIcon,
  ChevronLeftIcon,
  FIleTextIcon,
  KeyIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/Icons";
import { PreviewDashboardSite } from "./components/PreviewDashboardSite";
import { LoadingButton } from "@mui/lab";
import { useGetSiteId } from "@/hooks/useGetSiteId";

export const Dashboard = () => {
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [isLoadingConnectKeys, setLoadingConnectKeys] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const { siteId } = useGetSiteId();

  const getSite = data?.find((el) => el.id === siteId);

  const switchTheme = `/design?siteId=${siteId}&themeId=${getSite?.themeId}`;

  const openSettings = `/admin/${siteId}/settings`;
  const openPostManagement = `/admin/${siteId}/posts`;

  const handeOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handeCloseConfirm = (deleted: boolean) => {
    setOpenConfirm(false);
    if (deleted) router.push(`/admin`);
  };

  const handleConnectKeys = async () => {
    setLoadingConnectKeys(true);

    try {
      const newSiteId = await migrateToConnectedKey(siteId);
      enqueueSnackbar("Keys connected!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      setTimeout(() => {
        setLoadingConnectKeys(false);

        router.push(`/admin/${newSiteId}`);
      }, 500);
    } catch (e: any) {
      setLoadingConnectKeys(false);

      console.log("error", e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledWrapDashboard>
        <StyledTitle>
          <Button
            LinkComponent={Link}
            href="/admin"
            color="primary"
            variant="text"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Dashboard
        </StyledTitle>

        {getSite && (
          <PreviewDashboardSite
            settingsLink={openSettings}
            icon={getSite.icon}
            logo={getSite.logo}
            name={getSite.name}
            title={getSite.title}
            url={getSite.url}
            image={getSite.image}
            description={getSite.description}
            accentColor={getSite.accentColor}
            contributors={getSite.contributors}
            actions={
              <StyledActions>
                <Button
                  target="_blank"
                  LinkComponent={Link}
                  size="large"
                  variant="contained"
                  color="decorate"
                  href={getSite?.url}
                  fullWidth
                  endIcon={<ArrowRightIcon />}
                >
                  Open website
                </Button>

                <Button
                  LinkComponent={Link}
                  size="large"
                  variant="outlined"
                  color="decorate"
                  href={openPostManagement}
                  fullWidth
                  endIcon={<FIleTextIcon />}
                >
                  Post management
                </Button>

                <Button
                  LinkComponent={Link}
                  size="large"
                  variant="outlined"
                  color="decorate"
                  href={switchTheme}
                  fullWidth
                  endIcon={<BrushIcon />}
                >
                  Theme settings
                </Button>

                <Button
                  LinkComponent={Link}
                  size="large"
                  variant="outlined"
                  color="decorate"
                  href={openSettings}
                  fullWidth
                  endIcon={<SettingsIcon />}
                >
                  Settings
                </Button>

                {isNeedMigrateKey(siteId) && (
                  <LoadingButton
                    color="decorate"
                    variant="outlined"
                    type="submit"
                    fullWidth
                    size="large"
                    loading={isLoadingConnectKeys}
                    disabled={isLoadingConnectKeys}
                    endIcon={<KeyIcon />}
                    onClick={handleConnectKeys}
                  >
                    Connect keys
                  </LoadingButton>
                )}

                <Button
                  size="large"
                  variant="outlined"
                  color="error"
                  onClick={handeOpenConfirm}
                  fullWidth
                  endIcon={<TrashIcon />}
                >
                  Delete
                </Button>
              </StyledActions>
            }
          />
        )}

        <ModalConfirmDeleteSite
          isOpen={isOpenConfirm}
          siteId={siteId}
          handleClose={handeCloseConfirm}
        />
      </StyledWrapDashboard>
    </Container>
  );
};
