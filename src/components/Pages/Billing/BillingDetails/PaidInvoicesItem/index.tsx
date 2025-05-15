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
import { ReturnInvoiceType } from "@/services/billing.service";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { format } from "date-fns";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";

interface PaidInvoicesItemProps {
  invoiceInfo: {
    id: number;
    invoice: ReturnInvoiceType;
    siteInfo?: ReturnSettingsSiteDataType;
  };
}

export const PaidInvoicesItem = ({ invoiceInfo }: PaidInvoicesItemProps) => {
  const paidDate = format(
    new Date(invoiceInfo.invoice.paid_timestamp * 1000),
    "MMM dd, yyyy hh:mm a",
  );

  const timestampDueDate =
    invoiceInfo.invoice.due_timestamp !== 0
      ? invoiceInfo.invoice.due_timestamp
      : invoiceInfo.invoice.paid_timestamp;

  const pastDueDate = format(
    new Date(timestampDueDate * 1000),
    "MMM dd, yyyy hh:mm a",
  );

  const { currencies } = useConvertCurrency(invoiceInfo.invoice.amount);

  const { usd } = currencies;

  return (
    <StyledCard>
      <StyledAmountWrap>
        <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.PAID} />
        <TotalAmount size="small" usd={usd} />
      </StyledAmountWrap>

      <StyledFeatureList>
        <StyledPaidInvoicesHead>
          <StyledFeature>
            <Typography variant="body5">Invoice #{invoiceInfo.id}</Typography>
            <Typography variant="body5">Paid monthly</Typography>
          </StyledFeature>

          <Typography variant="subtitle4">
            Subscription{" "}
            <Typography component="span" variant="subtitle4" color="primary">
              PRO
            </Typography>{" "}
            for website {invoiceInfo.siteInfo?.title}
          </Typography>
        </StyledPaidInvoicesHead>

        <StyledFeature>
          <Typography variant="body5">Due Date</Typography>
          <Typography variant="body4" color="secondary">
            {pastDueDate}
          </Typography>
        </StyledFeature>

        <StyledFeature>
          <Typography variant="body5">Payment Date</Typography>
          <Typography variant="body4" color="secondary">
            {paidDate}
          </Typography>
        </StyledFeature>
      </StyledFeatureList>
    </StyledCard>
  );
};
