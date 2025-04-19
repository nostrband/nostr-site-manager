import { CheckIcon } from "@/components/Icons";
import { StyledCard } from "@/components/shared/styled";
import { Button, Divider, Typography } from "@mui/material";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { StyledFeatureSubscription } from "../../../styled";
import {
  SiteBaseInfoPreview,
  SiteBaseInfoPreviewProps,
} from "@/components/shared/SiteBaseInfoPreview";

interface ISubscriptionItem extends SiteBaseInfoPreviewProps {
  prices: {
    usd: number;
    sats: number;
  };

  onClick: () => void;

  isLoading: boolean;
}

export const SubscriptionItem = ({
  siteInfo,
  prices,
  onClick,
  isLoading,
}: ISubscriptionItem) => {
  const { usd, sats } = prices;

  return (
    <StyledCard>
      <Typography variant="h5">
        Upgrade to{" "}
        <Typography component="span" variant="h5" color="primary">
          PRO
        </Typography>
      </Typography>

      <SiteBaseInfoPreview siteInfo={siteInfo} />

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
        <TotalAmount usd={usd} sats={sats} />
      </TotalAmountDescription>

      <Button
        loading={isLoading}
        disabled={isLoading}
        onClick={onClick}
        fullWidth
        size="large"
        variant="contained"
      >
        Subscribe
      </Button>
    </StyledCard>
  );
};
