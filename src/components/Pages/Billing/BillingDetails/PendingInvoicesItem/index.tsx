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
import { ReturnInvoiceType } from "@/services/billing.service";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { format } from "date-fns";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";

interface PendingInvoicesItemProps {
  invoiceInfo: {
    isSelected: boolean;
    id: number;
    invoice: ReturnInvoiceType;
    siteInfo?: ReturnSettingsSiteDataType;
  };
}

export const PendingInvoicesItem = ({
  invoiceInfo,
}: PendingInvoicesItemProps) => {
  const pastDueDate = format(
    new Date(invoiceInfo.invoice.due_timestamp * 1000),
    "MMM dd, yyyy hh:mm a",
  );

  const { currencies } = useConvertCurrency(invoiceInfo.invoice.amount);

  const { usd, sats } = currencies;

  return (
    <StyledWrap>
      <StyledAmountWrap>
        <Checkbox checked={invoiceInfo.isSelected} />
        <StatusSubscription subscriptionPlan={SUBSCRIPTION_PLAN.UNPAID} />
        <StyledTotalAmount>
          <TotalAmount size="small" usd={usd} sats={sats} />
        </StyledTotalAmount>
      </StyledAmountWrap>

      <StyledFeatureList>
        <StyledPendingInvoicesHead>
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
        </StyledPendingInvoicesHead>

        <StyledFeature>
          <Typography variant="body5">Due Date</Typography>
          <Typography variant="body4" color="secondary">
            {pastDueDate}
          </Typography>
        </StyledFeature>
      </StyledFeatureList>
    </StyledWrap>
  );
};
