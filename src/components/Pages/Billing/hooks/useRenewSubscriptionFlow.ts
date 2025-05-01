import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrices } from "@/hooks/usePrices";
import { useServices } from "@/hooks/useServices";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";
import { useInvoices } from "@/hooks/useInvoices";
import { getSubscriptionStatus } from "@/utils";
import { createOrder, unsubscribeService } from "@/services/billing.service";
import { useQueryClient } from "@tanstack/react-query";

export const useRenewSubscriptionFlow = () => {
  const router = useRouter();
  const params = useSearchParams();

  const siteId = useMemo(() => params.get("siteId"), [params]);
  const serviceId = useMemo(() => params.get("serviceId"), [params]);
  const priceId = useMemo(() => params.get("priceId"), [params]);

  const {
    data: prices,
    isLoading: loadingP,
    isFetching: fetchingP,
  } = usePrices();
  const {
    data: services,
    isLoading: loadingS,
    isFetching: fetchingS,
  } = useServices();
  const { siteInfo, isLoadingBaseInfo } = useSiteBaseInfo(siteId);
  const {
    data: invoices,
    isLoading: loadingI,
    isFetching: fetchingI,
  } = useInvoices();
  const queryClient = useQueryClient();

  const isLoading = useMemo(
    () =>
      loadingP ||
      fetchingP ||
      loadingS ||
      fetchingS ||
      isLoadingBaseInfo ||
      loadingI ||
      fetchingI,
    [
      loadingP,
      fetchingP,
      loadingS,
      fetchingS,
      isLoadingBaseInfo,
      loadingI,
      fetchingI,
    ],
  );

  const currentService = useMemo(
    () => services?.find((s) => s.id === serviceId),
    [services, serviceId],
  );

  const subscriptionStatus = useMemo(
    () => getSubscriptionStatus(currentService?.paid_until ?? 0),
    [currentService],
  );
  const dateFinishSubscribe = useMemo(
    () => currentService?.cancel_tm ?? 0,
    [currentService],
  );

  const amount = useMemo(
    () => prices?.find((p) => p.id === priceId)?.amount ?? 0,
    [prices, priceId],
  );

  const [isSubmitting, setSubmitting] = useState(false);

  const handlePay = useCallback(async () => {
    if (!serviceId || !invoices) return;
    setSubmitting(true);
    try {
      const inv = invoices.find((i) => i.id);
      if (!inv) return;
      await createOrder([inv.id]);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, [serviceId, invoices]);

  const handleUnsubscribe = useCallback(async () => {
    if (!serviceId) return;
    setSubmitting(true);
    try {
      await unsubscribeService(serviceId);
      await queryClient.invalidateQueries({ queryKey: ["billing-services"] });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }, [serviceId, queryClient]);

  useEffect(() => {
    if (!siteId) return;
    if (!currentService && !loadingS && !fetchingS) {
      router.push("/admin");
    }
  }, [siteId, currentService, loadingS, fetchingS, router]);

  return {
    isLoading,
    isSubmitting,
    siteInfo,
    subscriptionStatus,
    dateFinishSubscribe,
    amount,
    isActionsDisabled: !currentService,
    handlePay,
    handleUnsubscribe,
  };
};
