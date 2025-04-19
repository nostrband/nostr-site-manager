"use client";
import { Button, Container } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage } from "@/components/shared/styled";
import { RenewSubscriptionItem } from "./components/RenewSubscriptionItem";
import { StyledWrapColumn } from "../styled";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrices } from "@/hooks/usePrices";
import { getSubscriptionStatus } from "@/utils";
import { useServices } from "@/hooks/useServices";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";

const RenewSubscription = () => {
  const { data: dataServices } = useServices();
  const {
    data: dataPrices,
    isLoading: isLoadingPrices,
    isFetching: isFetchingPrices,
  } = usePrices();

  const router = useRouter();
  const params = useSearchParams();
  const siteId = params.get("siteId");
  const serviceId = params.get("serviceId");
  const priceId = params.get("priceId");

  const { isLoadingBaseInfo, siteInfo } = useSiteBaseInfo(siteId);

  const subscriptionAmount =
    (dataPrices ?? []).find((el) => el.id === priceId)?.amount ?? 0;

  const { currencies, isPending } = useConvertCurrency(subscriptionAmount);

  const getService = dataServices?.find((el) => el.id === serviceId);
  const subscriptionStatus = getSubscriptionStatus(
    getService ? getService.paid_until : 0,
  );

  if (isLoadingBaseInfo || isLoadingPrices || isFetchingPrices || isPending) {
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
            onClick={router.back}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Renew Subscription
        </StyledTitlePage>

        <RenewSubscriptionItem
          subscriptionPlan={subscriptionStatus}
          siteInfo={siteInfo}
          prices={currencies}
        />
      </StyledWrapColumn>
    </Container>
  );
};

export default RenewSubscription;
