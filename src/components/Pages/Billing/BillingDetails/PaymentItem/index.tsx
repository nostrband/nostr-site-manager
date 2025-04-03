import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { StyledCard } from "@/components/shared/styled";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { SUBSCRIPTION_PLAN } from "@/consts";
import {
  StyledAmountWrap,
  StyledDate,
  StyledPaymentInvoice,
  StyledPaymentInvoiceInfo,
  StyledPaymentInvoicePrice,
  StyledPaymentItem,
} from "./styled";
import { Box, Typography } from "@mui/material";

export const PaymentItem = () => {
  return (
    <StyledCard>
      <StyledPaymentItem>
        <StyledAmountWrap>
          <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.PAID} />
          <TotalAmount size="medium" usd="30" sats="30,000" />
        </StyledAmountWrap>

        <StyledDate>
          <Typography variant="body5">Date</Typography>
          <Typography color="secondary" variant="body2">
            Jan 09, 2025 03:30 PM
          </Typography>
        </StyledDate>

        <Box>
          <StyledPaymentInvoice>
            <StyledPaymentInvoiceInfo>
              <Typography variant="body5">Invoice #3</Typography>
              <Typography color="secondary" variant="body2">
                Subscription PRO for website Crypto Example
              </Typography>
            </StyledPaymentInvoiceInfo>
            <StyledPaymentInvoicePrice>
              <Typography color="secondary" variant="body2">
                15 USD
              </Typography>
            </StyledPaymentInvoicePrice>
          </StyledPaymentInvoice>
          <StyledPaymentInvoice>
            <StyledPaymentInvoiceInfo>
              <Typography variant="body5">Invoice #3</Typography>
              <Typography color="secondary" variant="body2">
                Subscription PRO for website Crypto Example
              </Typography>
            </StyledPaymentInvoiceInfo>
            <StyledPaymentInvoicePrice>
              <Typography color="secondary" variant="body2">
                15 USD
              </Typography>
            </StyledPaymentInvoicePrice>
          </StyledPaymentInvoice>
        </Box>
      </StyledPaymentItem>
    </StyledCard>
  );
};
