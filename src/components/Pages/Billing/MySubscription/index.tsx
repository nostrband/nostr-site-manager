"use client";
import { Button, Container, Grid } from "@mui/material";
import { useListSites } from "@/hooks/useListSites";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage } from "@/components/shared/styled";
import { MySubscriptionItem } from "./components/MySubscriptionItem";
import { useRouter } from "next/navigation";
import { useServices } from "@/hooks/useServices";
import { getSubscriptionStatus } from "@/utils";
import Link from "next/link";
import { StyledCardActionArea } from "../styled";

const MySubscription = () => {
  const { data, isLoading, isFetching } = useListSites();
  const { data: dataServices } = useServices();
  const router = useRouter();

  const getServices = () => {
    if (data && dataServices) {
      return dataServices.map((el) => {
        const { object_id, paid_until, id, price_id } = el;

        const subscriptionStatus = getSubscriptionStatus(paid_until);

        const getSite = data?.find((el) => el.id === object_id);

        const { logo = "", name = "", title = "", url = "" } = getSite || {};

        const siteInfo = {
          logo,
          name,
          title,
          url,
        };

        return {
          siteInfo,
          subscriptionPlan: subscriptionStatus,
          serviceId: id,
          priceId: price_id,
          siteId: object_id,
        };
      });
    } else {
      return [];
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
      <StyledTitlePage>
        <Button
          onClick={router.back}
          variant="text"
          color="secondary"
          sx={{ minWidth: "auto" }}
        >
          <ChevronLeftIcon />
        </Button>
        My Subscription
      </StyledTitlePage>

      <Grid container spacing={{ xs: "16px", sm: "24px" }}>
        {getServices().map((el, i) => {
          return (
            <Grid key={i} item xs={12} sm={6} lg={4}>
              <StyledCardActionArea
                LinkComponent={Link}
                // @ts-expect-error err
                href={`/admin/renew-subscription?serviceId=${el.serviceId}&priceId=${el.priceId}&siteId=${el.siteId}`}
              >
                <MySubscriptionItem
                  subscriptionPlan={el.subscriptionPlan}
                  siteInfo={el.siteInfo}
                />
              </StyledCardActionArea>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default MySubscription;
