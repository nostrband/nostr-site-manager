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
  onOpen: (id: string, isCompleted: boolean) => void;
  subscriptionPlan: string;
}

export const ItemTask = ({ task, onOpen, subscriptionPlan }: ItemTaskProps) => {
  const { isCompleted, id } = task;

  const handleOpen = () => {
    onOpen(id, isCompleted);
  };

  const isPro = subscriptionPlan === "pro";

  return (
    <StyledWrap onClick={handleOpen}>
      <StyledIcon isCompleted={isCompleted}>
        {isCompleted ? <CheckIcon /> : <CircleIcon />}
      </StyledIcon>

      <Typography variant="subtitle4">{task.text}</Typography>

      <StyledActions>
        {isPro && (
          <SubscriptionPlanBadge subscriptionPlan={SUBSCRIPTION_PLAN.PAID} />
        )}

        <StyledIconChevron>
          <ChevronLeftIcon />
        </StyledIconChevron>
      </StyledActions>
    </StyledWrap>
  );
};
