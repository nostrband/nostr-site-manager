import { CheckIcon, ChevronLeftIcon, CircleIcon } from "@/components/Icons";
import {
  StyledActions,
  StyledIcon,
  StyledIconChevron,
  StyledWrap,
} from "../styled";
import { TaskType } from "@/types";
import { Typography } from "@mui/material";
import { SubscriptionPlanBadge } from "@/components/shared/SubscriptionPlanBadge";
import { SUBSCRIPTION_PLAN } from "@/consts";

interface ItemTaskProps {
  task: TaskType;
  onOpen: (
    id: string,
    isCompleted: boolean,
    isRedirectToSubscribtion: boolean,
  ) => void;
  subscriptionPlan: string;
  isProPlan: boolean;
  statusPlan: SUBSCRIPTION_PLAN;
}

export const ItemTask = ({
  task,
  onOpen,
  subscriptionPlan,
  isProPlan,
  statusPlan,
}: ItemTaskProps) => {
  const { isCompleted, id } = task;

  const isPro = subscriptionPlan === "pro";

  const isRedirectToSubscribtion =
    (!isProPlan && isPro) ||
    (isProPlan && statusPlan !== SUBSCRIPTION_PLAN.PAID && isPro);

  const handleOpen = () => {
    onOpen(id, isCompleted, isRedirectToSubscribtion);
  };

  return (
    <StyledWrap onClick={handleOpen}>
      <StyledIcon isCompleted={isCompleted}>
        {isCompleted ? <CheckIcon /> : <CircleIcon />}
      </StyledIcon>

      <Typography variant="subtitle4">{task.text}</Typography>

      <StyledActions>
        {isPro && <SubscriptionPlanBadge subscriptionPlan={statusPlan} />}

        <StyledIconChevron>
          <ChevronLeftIcon />
        </StyledIconChevron>
      </StyledActions>
    </StyledWrap>
  );
};
