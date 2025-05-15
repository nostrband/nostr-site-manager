import { StatusSubscription } from "@/components/shared/StatusSubscription";
import { StyledCard } from "@/components/shared/styled";
import { TotalAmount } from "@/components/shared/TotalAmount";
import { SUBSCRIPTION_PLAN } from "@/consts";
import {
  StyledAmountWrap,
  StyledDate,
  StyledInvoices,
  StyledPaymentItem,
} from "./styled";
import { Typography } from "@mui/material";
import { ReturnInvoiceType, ReturnOrderType } from "@/services/billing.service";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";
import { format } from "date-fns";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { InvoiceInfo } from "./components/InvoiceInfo";

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
          <TotalAmount size="small" usd={currencies.usd} />
        </StyledAmountWrap>

        <StyledDate>
          <Typography variant="body5">Date</Typography>
          <Typography color="secondary" variant="body2">
            {paymentDate}
          </Typography>
        </StyledDate>

        <StyledInvoices>
          {paymentInfo.invoices.map((el, i) => {
            return (
              <InvoiceInfo
                key={i}
                id={i + 1}
                amount={el.invoice.amount}
                titleSite={el.siteInfo ? el.siteInfo.title : ""}
              />
            );
          })}
        </StyledInvoices>
      </StyledPaymentItem>
    </StyledCard>
  );
};
