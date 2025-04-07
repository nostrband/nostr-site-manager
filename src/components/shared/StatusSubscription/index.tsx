import {
  SUBSCRIPTION_PLAN,
  SUBSCRIPTION_PLAN_COLOR,
  SUBSCRIPTION_PLAN_STATUS,
} from "@/consts";
import { StyledStatusSubscription } from "./styled";

export const StatusSubscription = ({
  subscriptionPlan,
}: {
  subscriptionPlan: SUBSCRIPTION_PLAN;
}) => {
  const isPaid = subscriptionPlan === SUBSCRIPTION_PLAN.PAID;

  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan];

  return (
    <StyledStatusSubscription
      icon={SUBSCRIPTION_PLAN_STATUS[subscriptionPlan].icon}
      color={isPaid ? "success" : colorIndicate}
    >
      {SUBSCRIPTION_PLAN_STATUS[subscriptionPlan].title}
    </StyledStatusSubscription>
  );
};
