import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { SUBSCRIPTION_PLAN } from "@/consts";
import {
  StyledAmountWrap,
  StyledFeature,
  StyledFeatureList,
  StyledPendingInvoicesHead,
  StyledTotalAmount,
  StyledWrap,
} from "./styled";
import { Checkbox, Typography } from "@mui/material";

export const PendingInvoicesItem = () => {
  return (
    <StyledWrap>
      <StyledAmountWrap>
        <Checkbox defaultChecked />
        <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.UNPAID} />
        <StyledTotalAmount>
          <TotalAmount size="small" usd="15" sats="15,000" />
        </StyledTotalAmount>
      </StyledAmountWrap>

      <StyledFeatureList>
        <StyledPendingInvoicesHead>
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
        </StyledPendingInvoicesHead>

        <StyledFeature>
          <Typography variant="body5">Due Date</Typography>
          <Typography variant="body4" color="secondary">
            Jan 09, 2025 03:30 PM
          </Typography>
        </StyledFeature>
      </StyledFeatureList>
    </StyledWrap>
  );
};
