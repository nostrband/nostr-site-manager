"use client";
import Link from "next/link";
import { Box, Button, Container, Grid } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useContext, useState } from "react";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";
import {
  ArrowRightIcon,
  BrushIcon,
  ChevronLeftIcon,
  FIleTextIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/Icons";
import { PreviewDashboardSite } from "./components/PreviewDashboardSite";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { StyledTitlePage } from "@/components/shared/styled";
import { TasksUser } from "./components/TasksUser";
import { StyledWrap } from "@/components/shared/styled";
import { AnalyticsSite } from "./components/AnalyticsSite";
import { useRouter } from "next/navigation";
import { getLinksMenu } from "@/utils";
import { CardFeatureContent } from "@/components/shared/CardFeatureContent";
import { StyledWrapMenu } from "./styled";

export const Dashboard = () => {
  const { isAuth } = useContext(AuthContext);
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const { data, isLoading, isFetching } = useListSites();
  const router = useRouter();
  const { siteId } = useGetSiteId();
  const getSite = data?.find((el) => el.id === siteId);

  const userIsAdmin =
    userPubkey && getSite && getSite.adminPubkey === userPubkey;

  const { linkSwitchTheme, linkSettings, linkPostManagement } = getLinksMenu(
    siteId,
    getSite?.themeId,
  );

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
    <Container maxWidth="lg">
      <StyledWrap>
        <StyledTitlePage>
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
        </StyledTitlePage>

        {getSite && (
          <Grid container spacing={{ xs: "24px" }}>
            <Grid item xs={12} sm={6}>
              <Box>
                <PreviewDashboardSite
                  settingsLink={linkSettings}
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
                  actions={<TasksUser siteId={getSite.id} />}
                />
              </Box>
              <ModalConfirmDeleteSite
                isOpen={isOpenConfirm}
                siteId={siteId}
                handleClose={handeCloseConfirm}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledWrapMenu>
                <CardFeatureContent title="Menu">
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
                    href={linkPostManagement}
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
                        href={linkSwitchTheme}
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
                        href={linkSettings}
                        fullWidth
                        endIcon={<SettingsIcon />}
                      >
                        Settings
                      </Button>

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
                </CardFeatureContent>
              </StyledWrapMenu>

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
