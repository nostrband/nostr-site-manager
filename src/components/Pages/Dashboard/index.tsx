"use client";
import Link from "next/link";
import { Button, Container, Grid } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useRouter } from "next/navigation";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React, { useContext, useState } from "react";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";

import {
  isNeedMigrateKey,
  migrateToConnectedKey,
} from "@/services/nostr/migrate";
import { useSnackbar } from "notistack";
import { StyledActions, StyledTitle } from "./styled";
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
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { StyledWrap } from "@/components/shared/styled";
import { AnalyticsSite } from "./components/AnalyticsSite";

export const Dashboard = () => {
  const { isAuth } = useContext(AuthContext);
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const [isLoadingConnectKeys, setLoadingConnectKeys] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching } = useListSites();

  const { siteId } = useGetSiteId();

  const getSite = data?.find((el) => el.id === siteId);

  // console.log({
  //   getSite,
  // });

  const userIsAdmin =
    userPubkey && getSite && getSite.adminPubkey === userPubkey;

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
      <StyledWrap>
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
          <Grid container spacing={{ xs: "24px" }}>
            <Grid item xs={12} sm={6}>
              <PreviewDashboardSite
                settingsLink={openSettings}
                logo={getSite.logo}
                name={getSite.name}
                title={getSite.title}
                url={getSite.url}
                image={getSite.image}
                adminPubkey={getSite.adminPubkey}
                userPubkey={isAuth ? userPubkey : undefined}
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
                      href={getSite.url}
                      fullWidth
                      endIcon={<ArrowRightIcon />}
                    >
                      Open
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
                      Posts
                    </Button>

                    {userIsAdmin && (
                      <>
                        <Button
                          LinkComponent={Link}
                          size="large"
                          variant="outlined"
                          color="decorate"
                          href={switchTheme}
                          fullWidth
                          endIcon={<BrushIcon />}
                        >
                          Theme
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
                      </>
                    )}
                  </StyledActions>
                }
              />

              <ModalConfirmDeleteSite
                isOpen={isOpenConfirm}
                siteId={siteId}
                handleClose={handeCloseConfirm}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AnalyticsSite
                siteId={getSite.id}
                isSendStats={getSite.sendStats}
              />
            </Grid>
          </Grid>
        )}
      </StyledWrap>
    </Container>
  );
};
