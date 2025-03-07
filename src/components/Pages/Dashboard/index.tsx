"use client";
import Link from "next/link";
import { Button, Container } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useContext } from "react";
import { StyledWrapDashboard } from "./styled";
import { ChevronLeftIcon } from "@/components/Icons";
import { PreviewDashboardSite } from "./components/PreviewDashboardSite";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { StyledTitlePage } from "@/components/shared/styled";
import { TasksUser } from "./components/TasksUser";

export const Dashboard = () => {
  const { isAuth } = useContext(AuthContext);

  const { data, isLoading, isFetching } = useListSites();
  console.log({
    data,
  });
  const { siteId } = useGetSiteId();

  const getSite = data?.find((el) => el.id === siteId);

  const settingsLink = `/admin/${siteId}/settings`;

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
          <PreviewDashboardSite
            settingsLink={settingsLink}
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
            actions={<TasksUser id={getSite.id} />}
          />
        )}
      </StyledWrapDashboard>
    </Container>
  );
};
