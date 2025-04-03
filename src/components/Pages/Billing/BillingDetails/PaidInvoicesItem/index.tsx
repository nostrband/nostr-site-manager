import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { StyledCard } from "@/components/shared/styled";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { SUBSCRIPTION_PLAN } from "@/consts";
import {
  StyledAmountWrap,
  StyledFeature,
  StyledFeatureList,
  StyledPaidInvoicesHead,
} from "./styled";
import { Typography } from "@mui/material";

export const PaidInvoicesItem = () => {
  return (
    <StyledCard>
      <StyledAmountWrap>
        <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.PAID} />
        <TotalAmount size="small" usd="30" sats="30,000" />
      </StyledAmountWrap>

      <StyledFeatureList>
        <StyledPaidInvoicesHead>
          <StyledFeature>
            <Typography variant="body5">Invoice #3</Typography>
            <Typography variant="body5">Paid monthly</Typography>
          </StyledFeature>

          <Typography variant="subtitle4">
            Subscription{" "}
            <Typography component="span" variant="subtitle4" color="primary">
              PRO
            </Typography>{" "}
            for website Crypto Example
          </Typography>
        </StyledPaidInvoicesHead>

        <StyledFeature>
          <Typography variant="body5">Due Date</Typography>
          <Typography variant="body4" color="secondary">
            Jan 09, 2025 03:30 PM
          </Typography>
        </StyledFeature>

        <StyledFeature>
          <Typography variant="body5">Payment Date</Typography>
          <Typography variant="body4" color="secondary">
            Jan 09, 2025 03:30 PM
          </Typography>
        </StyledFeature>
      </StyledFeatureList>
    </StyledCard>
  );
};
