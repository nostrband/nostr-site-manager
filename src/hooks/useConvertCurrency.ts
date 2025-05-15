import { getBtcUsdCurrencies } from "@/services/billing.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface ConversionResult {
  currencies: {
    usd: number;
    sats: number;
  };
  isPending: boolean;
  error: Error | null;
}

export const useConvertCurrency = (usdAmount: number): ConversionResult => {
  const {
    data: btcRate,
    isPending,
    error,
  } = useQuery<number, Error>({
    queryKey: ["btcRate"],
    queryFn: getBtcUsdCurrencies,

    refetchInterval: 15_000,
    refetchIntervalInBackground: true,
    staleTime: 15_000,
  });

  const usd = Math.round(usdAmount * 100) / 10000; // like as toFixed(2)

  const sats = useMemo(() => {
    if (!btcRate || btcRate <= 0) {
      return 0;
    }

    const btcAmount = usd / btcRate;

    return Math.round(btcAmount * 1e8);
  }, [usd, btcRate]);

  return {
    currencies: {
      usd,
      sats: isPending ? 0 : sats,
    },
    isPending,
    error: error || null,
  };
};
