import { BrokenIcon, CheckIcon } from "@/components/Icons";
import {
  StyledCardHeader,
  StyledCardSubHeader,
  StyledCardTitle,
} from "@/components/PreviewSite/styled";
import { StyledAvatarSite, StyledCard } from "@/components/shared/styled";
import useImageLoader from "@/hooks/useImageLoader";
import { Button, Divider, Typography } from "@mui/material";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { StyledFeatureSubscription } from "../../../styled";

interface ISubscriptionItem {
  siteInfo: {
    logo: string;
    name: string;
    title: string;
    url: string;
  };
}

export const SubscriptionItem = ({ siteInfo }: ISubscriptionItem) => {
  const { logo, name, title, url } = siteInfo;

  const { isLoaded: isLoadedLogo } = useImageLoader(logo);

  return (
    <StyledCard>
      <Typography variant="h5">
        Upgrade to{" "}
        <Typography component="span" variant="h5" color="primary">
          PRO
        </Typography>
      </Typography>

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

      <Typography variant="body4">
        By subscribing to this site you will receive the following benefits:
      </Typography>

      <StyledFeatureSubscription icon={<CheckIcon color="primary" />}>
        Better SEO and link previews - up to 10000 site pages
      </StyledFeatureSubscription>
      <StyledFeatureSubscription icon={<CheckIcon color="primary" />}>
        Custom domain
      </StyledFeatureSubscription>
      <StyledFeatureSubscription icon={<CheckIcon color="primary" />}>
        Premium customer support
      </StyledFeatureSubscription>

      <Divider />

      <TotalAmountDescription description="total amount per month">
        <TotalAmount usd="30" sats="30,000" />
      </TotalAmountDescription>

      <Button fullWidth size="large" variant="contained">
        Subscribe
      </Button>
    </StyledCard>
  );
};
