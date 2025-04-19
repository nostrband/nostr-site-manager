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
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { TotalAmount } from "@/components/shared/TotalAmount";
import {
  SiteBaseInfoPreview,
  SiteBaseInfoPreviewProps,
} from "@/components/shared/SiteBaseInfoPreview";

interface IRenewSubscriptionItem extends SiteBaseInfoPreviewProps {
  subscriptionPlan: SubscriptionStatus;

  prices: {
    usd: number;
    sats: number;
  };
}

export const RenewSubscriptionItem = ({
  siteInfo,
  subscriptionPlan,
  prices,
}: IRenewSubscriptionItem) => {
  const { usd, sats } = prices;

  const isPaid = subscriptionPlan.status === SUBSCRIPTION_PLAN.PAID;

  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan.status];

  const icon =
    subscriptionPlan.status === SUBSCRIPTION_PLAN.PAST_DUE ? (
      <CrossIcon color={colorIndicate} />
    ) : (
      <CheckIcon color={colorIndicate} />
    );

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
          <TotalAmountDescription description="total amount">
            <TotalAmount usd={usd} sats={sats} />
          </TotalAmountDescription>
          <Button fullWidth size="large" variant="contained">
            Pay Now
          </Button>
        </>
      )}
      <Button color="error" fullWidth size="large" variant="text">
        Unsubscribe
      </Button>
    </StyledCard>
  );
};
