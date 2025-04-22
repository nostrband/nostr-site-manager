import { TotalAmount } from "@/components/shared/TotalAmount";
import { TotalAmountDescription } from "@/components/shared/TotalAmountDescription";
import { useConvertCurrency } from "@/hooks/useConvertCurrency";

export const TotalAmountSubscription = ({ amount }: { amount: number }) => {
  const { currencies, isPending } = useConvertCurrency(amount);
  const { usd, sats } = currencies;

  if (isPending) {
    return null;
  }

  return (
    <TotalAmountDescription description="total amount">
      <TotalAmount usd={usd} sats={sats} />
    </TotalAmountDescription>
  );
};
