import { SUBSCRIPTION_PLAN } from "@/consts";
import { StyledBadge } from "./styled";

interface ISubscriptionPlanBadge {
  subscriptionPlan: SUBSCRIPTION_PLAN;
  text?: string;
}

export const SubscriptionPlanBadge = ({
  subscriptionPlan,
  text,
}: ISubscriptionPlanBadge) => {
  return (
    <StyledBadge subscriptionPlan={subscriptionPlan}>
      {text ? text : "PRO"}
    </StyledBadge>
  );
};
