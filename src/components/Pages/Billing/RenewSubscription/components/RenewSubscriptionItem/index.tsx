import { CheckIcon, CrossIcon } from "@/components/Icons";
import { StyledCard } from "@/components/shared/styled";
import { Button, Divider, LinearProgress, Typography } from "@mui/material";
import {
  StyledFeatureSubscription,
  StyledProgress,
  StyledSubscriptionHead,
} from "../../../styled";
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_PLAN_COLOR } from "@/consts";
import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { SubscriptionStatus } from "@/utils";
import {
  SiteBaseInfoPreview,
  SiteBaseInfoPreviewProps,
} from "@/components/shared/SiteBaseInfoPreview";
import { TotalAmountSubscription } from "../TotalAmountSubscription";
import { format } from "date-fns";

interface IRenewSubscriptionItem extends SiteBaseInfoPreviewProps {
  subscriptionPlan: SubscriptionStatus;

  dateFinishSubscribe: number;

  amount: number;

  onPay: () => void;

  onUnsubscribe: () => void;

  isLoadingUnsubscribe: boolean;
}

export const RenewSubscriptionItem = ({
  siteInfo,
  subscriptionPlan,
  amount,
  dateFinishSubscribe,
  onPay,
  onUnsubscribe,
  isLoadingUnsubscribe,
}: IRenewSubscriptionItem) => {
  const isPaid = subscriptionPlan.status === SUBSCRIPTION_PLAN.PAID;
  const isPastDue = subscriptionPlan.status === SUBSCRIPTION_PLAN.PAST_DUE;

  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan.status];

  const icon =
    subscriptionPlan.status === SUBSCRIPTION_PLAN.PAST_DUE ? (
      <CrossIcon color={colorIndicate} />
    ) : (
      <CheckIcon color={colorIndicate} />
    );

  const isUnsubscribed = dateFinishSubscribe !== 0;

  const textButtonUnsubscribe = isUnsubscribed
    ? `Unsubscribed on ${format(
        new Date(dateFinishSubscribe * 1000),
        "dd.MM.yy",
      )}`
    : "Unsubscribe";

  const handleUnsubscribe = () => {
    if (!isUnsubscribed) {
      onUnsubscribe();
    }
  };

  return (
    <StyledCard>
      <StyledSubscriptionHead>
        <Typography variant="h5">
          <Typography component="span" variant="h5" color="primary">
            PRO
          </Typography>{" "}
          website
        </Typography>

        <StatusSubscription subscriptionPlan={subscriptionPlan.status} />
      </StyledSubscriptionHead>

      <SiteBaseInfoPreview siteInfo={siteInfo} />

      <StyledProgress>
        <Typography color="secondary" variant="body4">
          You have {subscriptionPlan.daysRemaining} days of{" "}
          <Typography component="span" variant="body2">
            {subscriptionPlan.totalPeriodDays}
          </Typography>
        </Typography>
        <LinearProgress
          color={colorIndicate}
          variant="determinate"
          value={subscriptionPlan.progressPercent}
        />
      </StyledProgress>

      <Typography variant="body4">
        By subscribing to this site you will receive the following benefits:
      </Typography>
      <StyledFeatureSubscription icon={icon}>
        Better SEO and link previews - up to 10000 site pages
      </StyledFeatureSubscription>
      <StyledFeatureSubscription icon={icon}>
        Custom domain
      </StyledFeatureSubscription>
      <StyledFeatureSubscription icon={icon}>
        Premium customer support
      </StyledFeatureSubscription>

      {!isPaid && (
        <>
          <Divider />
          <TotalAmountSubscription amount={amount} />
          <Button
            disabled={isLoadingUnsubscribe}
            loading={isLoadingUnsubscribe}
            onClick={onPay}
            fullWidth
            size="large"
            variant="contained"
          >
            Pay Now
          </Button>
        </>
      )}
      {!isPastDue && (
        <Button
          onClick={handleUnsubscribe}
          color="error"
          fullWidth
          size="large"
          variant="text"
          disabled={isLoadingUnsubscribe || isUnsubscribed}
          loading={isLoadingUnsubscribe}
        >
          {textButtonUnsubscribe}
        </Button>
      )}
    </StyledCard>
  );
};
