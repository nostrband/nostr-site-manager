import { BrokenIcon, CheckIcon, CrossIcon } from "@/components/Icons";
import {
  StyledCardHeader,
  StyledCardSubHeader,
  StyledCardTitle,
} from "@/components/PreviewSite/styled";
import { StyledAvatarSite, StyledCard } from "@/components/shared/styled";
import useImageLoader from "@/hooks/useImageLoader";
import { Button, LinearProgress, Typography } from "@mui/material";
import {
  StyledFeatureSubscription,
  StyledProgress,
  StyledSubscriptionHead,
} from "../../../styled";
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_PLAN_COLOR } from "@/consts";
import { StatusSubscription } from "@/components/shared/StatusSubscription";

interface IRenewSubscriptionItem {
  siteInfo: {
    logo: string;
    name: string;
    title: string;
    url: string;
  };

  subscriptionPlan: SUBSCRIPTION_PLAN;
}

export const RenewSubscriptionItem = ({
  siteInfo,
  subscriptionPlan,
}: IRenewSubscriptionItem) => {
  const { logo, name, title, url } = siteInfo;

  const { isLoaded: isLoadedLogo } = useImageLoader(logo);

  const isPaid = subscriptionPlan === SUBSCRIPTION_PLAN.PAID;

  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan];

  const icon =
    subscriptionPlan === SUBSCRIPTION_PLAN.PAST_DUE ? (
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

        <StatusSubscription subscriptionPlan={subscriptionPlan} />
      </StyledSubscriptionHead>

      <StyledCardHeader
        avatar={
          isLoadedLogo ? (
            <StyledAvatarSite variant="square" src={logo}>
              {name}
            </StyledAvatarSite>
          ) : (
            <StyledAvatarSite variant="square">
              <BrokenIcon fontSize="inherit" />
            </StyledAvatarSite>
          )
        }
        title={<StyledCardTitle variant="h6">{title}</StyledCardTitle>}
        subheader={
          <StyledCardSubHeader variant="body5">{url}</StyledCardSubHeader>
        }
      />

      <StyledProgress>
        <Typography color="secondary" variant="body4">
          You have 25 days of{" "}
          <Typography component="span" variant="body2">
            30
          </Typography>
        </Typography>
        <LinearProgress
          color={colorIndicate}
          variant="determinate"
          value={35}
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
        <Button fullWidth size="large" variant="contained">
          Pay Now $60
        </Button>
      )}
      <Button color="error" fullWidth size="large" variant="text">
        Unsubscribe
      </Button>
    </StyledCard>
  );
};
