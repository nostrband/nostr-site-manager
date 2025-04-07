"use client";
import Link from "next/link";
import { Button, Container, Grid } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import { StyledTitlePage } from "@/components/shared/styled";
import { MySubscriptionItem } from "./components/MySubscriptionItem";
import { SUBSCRIPTION_PLAN } from "@/consts";

const MySubscription = () => {
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
        My Subscription
      </StyledTitlePage>

      <Grid container spacing={{ xs: "16px", sm: "24px" }}>
        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.PAID}
            siteInfo={siteInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.UNPAID}
            siteInfo={siteInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.PAST_DUE}
            siteInfo={siteInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.PAID}
            siteInfo={siteInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.UNPAID}
            siteInfo={siteInfo}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <MySubscriptionItem
            subscriptionPlan={SUBSCRIPTION_PLAN.PAST_DUE}
            siteInfo={siteInfo}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default MySubscription;
