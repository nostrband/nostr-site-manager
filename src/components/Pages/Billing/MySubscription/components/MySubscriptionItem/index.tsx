import { BrokenIcon } from "@/components/Icons";
import {
  StyledCardHeader,
  StyledCardSubHeader,
  StyledCardTitle,
} from "@/components/PreviewSite/styled";
import { StyledAvatarSite, StyledCard } from "@/components/shared/styled";
import useImageLoader from "@/hooks/useImageLoader";
import { LinearProgress, Typography } from "@mui/material";
import { StyledProgress, StyledSubscriptionHead } from "../../../styled";
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_PLAN_COLOR } from "@/consts";
import { StatusSubscription } from "@/components/shared/StatusSubscription";

interface IMySubscriptionItem {
  siteInfo: {
    logo: string;
    name: string;
    title: string;
    url: string;
  };

  subscriptionPlan: SUBSCRIPTION_PLAN;
}

export const MySubscriptionItem = ({
  siteInfo,
  subscriptionPlan,
}: IMySubscriptionItem) => {
  const { logo, name, title, url } = siteInfo;

  const { isLoaded: isLoadedLogo } = useImageLoader(logo);

  const colorIndicate = SUBSCRIPTION_PLAN_COLOR[subscriptionPlan];

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
    </StyledCard>
  );
};
