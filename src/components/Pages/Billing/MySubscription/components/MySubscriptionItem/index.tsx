import { StyledCard } from "@/components/shared/styled";
import { LinearProgress, Typography } from "@mui/material";
import {
  StyledCardActionArea,
  StyledProgress,
  StyledSubscriptionHead,
} from "../../../styled";
import { SUBSCRIPTION_PLAN_COLOR } from "@/consts";
import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { SubscriptionStatus } from "@/utils";
import {
  SiteBaseInfoPreview,
  SiteBaseInfoPreviewProps,
} from "@/components/shared/SiteBaseInfoPreview";

interface IMySubscriptionItem extends SiteBaseInfoPreviewProps {
  subscriptionPlan: SubscriptionStatus;
}

export const MySubscriptionItem = ({
  siteInfo,
  subscriptionPlan,
}: IMySubscriptionItem) => {
  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan.status];

  return (
    <StyledCardActionArea>
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
      </StyledCard>
    </StyledCardActionArea>
  );
};
