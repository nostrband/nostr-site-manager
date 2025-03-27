"use client";
import Link from "next/link";
import { Button, Container } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { StyledTitlePage } from "@/components/shared/styled";
import { StyledWrapColumn } from "../styled";
import { SubscriptionItem } from "./components/SubscriptionItem";

const Subscription = () => {
  const { data, isLoading, isFetching } = useListSites();
  const { siteId } = useGetSiteId();
  const getSite = data?.find((el) => el.id === siteId);

  const { logo = "", name = "", title = "", url = "" } = getSite || {};

  const siteInfo = {
    logo,
    name,
    title,
    url,
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
      <StyledWrapColumn>
        <StyledTitlePage>
          <Button
            LinkComponent={Link}
            href="/admin"
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Subscription
        </StyledTitlePage>

        <SubscriptionItem siteInfo={siteInfo} />
      </StyledWrapColumn>
    </Container>
  );
};

export default Subscription;
