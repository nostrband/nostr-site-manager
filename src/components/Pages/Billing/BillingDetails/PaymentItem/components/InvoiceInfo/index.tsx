import { Typography } from "@mui/material";
import {
  StyledPaymentInvoice,
  StyledPaymentInvoiceInfo,
  StyledPaymentInvoicePrice,
} from "../../styled";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";

interface InvoiceInfoProps {
  id: number;
  titleSite: string;
  amount: number;
}

export const InvoiceInfo = ({ amount, id, titleSite }: InvoiceInfoProps) => {
  const { currencies } = useConvertCurrency(amount);

  return (
    <StyledPaymentInvoice key={id}>
      <StyledPaymentInvoiceInfo>
        <Typography variant="body5">Invoice #{id}</Typography>
        <Typography color="secondary" variant="body2">
          Subscription PRO for website {titleSite}
        </Typography>
      </StyledPaymentInvoiceInfo>
      <StyledPaymentInvoicePrice>
        <Typography color="secondary" variant="body2">
          {currencies.usd} USD
        </Typography>
      </StyledPaymentInvoicePrice>
    </StyledPaymentInvoice>
  );
};
