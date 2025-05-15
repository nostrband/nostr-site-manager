import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrices } from "@/hooks/usePrices";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";
import { useServices } from "@/hooks/useServices";
import { useListSites } from "@/hooks/useListSites";
import { byPlan } from "@/services/billing.service";

export const useSubscriptionFlow = () => {
  const router = useRouter();
  const params = useSearchParams();

  const siteId = useMemo(() => params.get("siteId"), [params]);
  const plan = useMemo(() => params.get("plan"), [params]);
  const type = useMemo(() => params.get("type"), [params]);

  const {
    data: prices,
    isLoading: isLoadingPrices,
    isFetching: isFetchingPrices,
  } = usePrices();
  const {
    data: sites,
    isLoading: isLoadingSites,
    isFetching: isFetchingSites,
  } = useListSites();
  const {
    data: services,
    isLoading: isLoadingServices,
    isFetching: isFetchingServices,
  } = useServices();
  const { siteInfo, isLoadingBaseInfo } = useSiteBaseInfo(siteId);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const subscriptionAmount = useMemo(() => {
    return prices?.find((p) => p.plan === plan && p.type === type)?.amount ?? 0;
  }, [prices, plan, type]);

  const { currencies, isPending: isConvertingCurrency } =
    useConvertCurrency(subscriptionAmount);

  const isLoading =
    isLoadingPrices ||
    isFetchingPrices ||
    isLoadingSites ||
    isFetchingSites ||
    isLoadingServices ||
    isFetchingServices ||
    isLoadingBaseInfo ||
    isConvertingCurrency;

  const isDisabled = useMemo(() => {
    if (
      !siteId ||
      isLoadingSites ||
      isFetchingSites ||
      isLoadingServices ||
      isFetchingServices
    )
      return true;

    const siteExists = sites?.some((site) => site.id === siteId);
    const serviceExists = services?.some((svc) => svc.object_id === siteId);

    return !siteExists || !!serviceExists;
  }, [
    siteId,
    sites,
    services,
    isLoadingSites,
    isFetchingSites,
    isLoadingServices,
    isFetchingServices,
  ]);

  useEffect(() => {
    if (
      !siteId ||
      isLoadingSites ||
      isFetchingSites ||
      isLoadingServices ||
      isFetchingServices
    )
      return;

    const siteExists = sites?.some((site) => site.id === siteId);
    if (!siteExists) {
      router.push("/admin");
    }

    const existingService = services?.find((svc) => svc.object_id === siteId);

    if (existingService) {
      router.replace(
        `/admin/renew-subscription?serviceId=${existingService.id}&priceId=${existingService.price_id}&siteId=${siteId}`,
      );
    }
  }, [
    siteId,
    sites,
    services,
    router,
    isLoadingSites,
    isFetchingSites,
    isLoadingServices,
    isFetchingServices,
  ]);

  const handleSubscribe = async () => {
    if (!siteId) return;

    setIsSubscribing(true);
    try {
      const order = await byPlan(siteId);

      router.push(
        `/admin/order?orderId=${order.id}&siteId=${siteId}&checkoutUrl=${order.checkout_url}`,
      );
    } catch (e) {
      console.error(e);
      setIsSubscribing(false);
    }
  };

  return {
    isLoading,
    isDisabled,
    handleSubscribe,
    isSubscribing,
    siteInfo,
    currencies,
  };
};
