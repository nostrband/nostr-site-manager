import { SUBSCRIPTION_PLAN } from "@/consts";
import { StyledBadge } from "./styled";

interface ISubscriptionPlanBadge {
  subscriptionPlan: SUBSCRIPTION_PLAN;
}

export const SubscriptionPlanBadge = ({
  subscriptionPlan,
}: ISubscriptionPlanBadge) => {
  return <StyledBadge subscriptionPlan={subscriptionPlan}>PRO</StyledBadge>;
};
