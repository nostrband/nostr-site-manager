import { getSubscriptionStatus } from "@/utils";
import { usePrices } from "./usePrices";
import { useServices } from "./useServices";
import { SUBSCRIPTION_PLAN } from "@/consts";

export const useServiceByPlan = (siteId: string) => {
  const { data: dataServices } = useServices();
  const { data: dataPrices } = usePrices();

  const plan = dataPrices?.find((el) => el.plan === "pro");

  const service = dataServices?.find(
    (el) => el.price_id === plan?.id && el.object_id === siteId,
  );

  return {
    service,
    isLoading: !dataServices || !dataPrices,
    isProPlan: Boolean(service),
    statusPlan: service
      ? getSubscriptionStatus(service.paid_until).status
      : SUBSCRIPTION_PLAN.PAID,
    urlRedirectToSubscription: `/admin/subscription?siteId=${siteId}&type=site&plan=pro`,
  };
};
