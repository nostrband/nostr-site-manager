"use client";
import { Button, Container } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage } from "@/components/shared/styled";
import { StyledWrapColumn } from "../styled";
import { SubscriptionItem } from "./components/SubscriptionItem";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrices } from "@/hooks/usePrices";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";
import { useState } from "react";
import { byPlan } from "@/services/billing.service";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";

const Subscription = () => {
  const [isLoading, setLoading] = useState(false);

  const {
    data: dataPrices,
    isLoading: isLoadingPrices,
    isFetching: isFetchingPrices,
  } = usePrices();

  const router = useRouter();
  const params = useSearchParams();
  const siteId = params.get("siteId");
  const plan = params.get("plan");
  const type = params.get("type");

  const { isLoadingBaseInfo, siteInfo } = useSiteBaseInfo(siteId);

  const subscriptionAmount =
    (dataPrices ?? []).find((el) => el.plan === plan && el.type === type)
      ?.amount ?? 0;

  const { currencies, isPending } = useConvertCurrency(subscriptionAmount);

  const handleSubscribe = async () => {
    if (siteId) {
      setLoading(true);
      try {
        const order = await byPlan(siteId);

        window.open(order.checkout_url, "_blank");

        router.push(`/admin/order?orderId=${order.id}&siteId=${siteId}`);
      } catch (error) {
        setLoading(false);
      }
    }
  };

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
          Subscription
        </StyledTitlePage>

        <SubscriptionItem
          isLoading={isLoading}
          onClick={handleSubscribe}
          siteInfo={siteInfo}
          prices={currencies}
        />
      </StyledWrapColumn>
    </Container>
  );
};

export default Subscription;
