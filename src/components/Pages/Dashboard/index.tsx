"use client";
import Link from "next/link";
import { Button, Container } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { useParams, useRouter } from "next/navigation";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import React, { useState } from "react";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";
import { userIsDelegated } from "@/services/nostr/nostr";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import { StyledActions, StyledTitle, StyledWrapDashboard } from "./styled";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/Icons";
import { PreviewDashboardSite } from "./components/PreviewDashboardSite";

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

  const handeOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handeCloseConfirm = (deleted: boolean) => {
    setOpenConfirm(false);
    if (deleted) router.push(`/admin`);
  };

  const handleConnectKeys = () => {
    document.dispatchEvent(
      new CustomEvent("nlLaunch", { detail: "import-otp" }),
    );
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
                  href={switchTheme}
                  fullWidth
                  endIcon={<BrushOutlinedIcon />}
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

                {userIsDelegated && (
                  <Button
                    size="large"
                    variant="outlined"
                    color="decorate"
                    onClick={handleConnectKeys}
                    fullWidth
                    endIcon={<VpnKeyOutlinedIcon />}
                  >
                    Connect keys
                  </Button>
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
