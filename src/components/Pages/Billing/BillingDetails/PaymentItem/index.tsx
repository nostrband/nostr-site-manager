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
import { ReturnInvoiceType, ReturnOrderType } from "@/services/billing.service";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";
import { format } from "date-fns";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

interface PaymentItemProps {
  paymentInfo: {
    order: ReturnOrderType;
    invoices: {
      invoice: ReturnInvoiceType;
      siteInfo?: ReturnSettingsSiteDataType;
    }[];
  };
}

export const PaymentItem = ({ paymentInfo }: PaymentItemProps) => {
  const { currencies } = useConvertCurrency(paymentInfo.order.amount);

  const paymentDate = format(
    new Date(paymentInfo.order.paid_timestamp * 1000),
    "MMM dd, yyyy hh:mm a",
  );

  return (
    <StyledCard>
      <StyledPaymentItem>
        <StyledAmountWrap>
          <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.PAID} />
          <TotalAmount
            size="small"
            usd={currencies.usd}
            sats={currencies.sats}
          />
        </StyledAmountWrap>

        <StyledDate>
          <Typography variant="body5">Date</Typography>
          <Typography color="secondary" variant="body2">
            {paymentDate}
          </Typography>
        </StyledDate>

        <Box>
          {paymentInfo.invoices.map((el, i) => {
            return (
              <StyledPaymentInvoice key={i}>
                <StyledPaymentInvoiceInfo>
                  <Typography variant="body5">Invoice #{i + 1}</Typography>
                  <Typography color="secondary" variant="body2">
                    Subscription PRO for website{" "}
                    {el.siteInfo && el.siteInfo.title}
                  </Typography>
                </StyledPaymentInvoiceInfo>
                <StyledPaymentInvoicePrice>
                  <Typography color="secondary" variant="body2">
                    {el.invoice.amount} USD
                  </Typography>
                </StyledPaymentInvoicePrice>
              </StyledPaymentInvoice>
            );
          })}
        </Box>
      </StyledPaymentItem>
    </StyledCard>
  );
};
