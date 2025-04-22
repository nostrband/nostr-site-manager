import { fetchWithSession } from "./nostr/nostr";

const BILLING_API_PATH = "https://billingapi.npubpro.com";

export type ReturnPriceType = {
  id: string;
  type: "site";
  plan: "pro";
  amount: number;
  unit: "usd";
  period: "1m";
  timestamp: number;
};

export type ReturnOrderType = {
  id: string;
  pubkey: string;
  amount: number;
  unit: "usd";
  invoice_ids: string;
  checkout_url: string;
  paid_timestamp: number;
  timestamp: number;
  error: string;
};

export type ReturnServiceType = {
  id: string;
  pubkey: string;
  price_id: string;
  object_id: string;
  timestamp: number;
  paid_until: number;
  cancel_tm: number;
};

export type ReturnInvoiceType = {
  id: string;
  pubkey: string;
  service_id: string;
  timestamp: number;
  price_id: string;
  amount: number;
  unit: "usd";
  period: "1m";
  due_timestamp: number;
  paid_timestamp: number;
  paid_order_id: string;
};

export const getPrices = async (): Promise<ReturnPriceType[]> => {
  try {
    const res = await fetchWithSession(
      "/prices",
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { prices: ReturnPriceType[] } = await res.json();

    return data.prices;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getInvoices = async (params?: {
  paid: boolean;
}): Promise<ReturnInvoiceType[]> => {
  const url =
    params === undefined ? "/invoices" : `/invoices?paid=${params.paid}`;
  try {
    const res = await fetchWithSession(
      url,
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { invoices: ReturnInvoiceType[] } = await res.json();

    return data.invoices;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getServices = async (): Promise<ReturnServiceType[]> => {
  try {
    const res = await fetchWithSession(
      "/services",
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { services: ReturnServiceType[] } = await res.json();

    return data.services;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getOrders = async (): Promise<ReturnOrderType[]> => {
  try {
    const res = await fetchWithSession(
      "/orders",
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { orders: ReturnOrderType[] } = await res.json();

    return data.orders;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const byPlan = async (siteId: string): Promise<ReturnOrderType> => {
  try {
    const res = await fetchWithSession(
      `/pro?site=${siteId}`,
      undefined,
      "post",
      BILLING_API_PATH,
    );

    const data: { order: ReturnOrderType } = await res.json();

    return data.order;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createOrder = async (
  invoices: string[],
): Promise<ReturnOrderType> => {
  try {
    const res = await fetchWithSession(
      `/order?invoices=${invoices.join(",")}`,
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { order: ReturnOrderType } = await res.json();

    return data.order;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const unsubscribeService = async (
  serviceId: string,
): Promise<ReturnOrderType> => {
  try {
    const res = await fetchWithSession(
      `/unsubscribe?service=${serviceId}`,
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { order: ReturnOrderType } = await res.json();

    return data.order;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getOrderById = async (
  orderId: string,
): Promise<ReturnOrderType | undefined> => {
  try {
    const res = await fetchWithSession(
      `/orders?id=${orderId}`,
      undefined,
      undefined,
      BILLING_API_PATH,
    );

    const data: { orders: ReturnOrderType[] } = await res.json();

    return data.orders.find((el: ReturnOrderType) => el.id === orderId);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getBtcUsdCurrencies = async (): Promise<number> => {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    );

    const data: { bitcoin: { usd: number } } = await res.json();

    return data.bitcoin.usd;
  } catch (error: any) {
    throw new Error(error);
  }
};

// export const getBtcUsdCurrenciesByTimestamp = async (
//   timestamp: number
// ): Promise<number> => {
//   try {
//     const res = await fetch(
//       `https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${timestamp}&end=${timestamp}`
//     );

//     console.log({res})

//     // const data: { bitcoin: { usd: number } } = await res.json();

//     // return data.bitcoin.usd;
//   } catch (error: any) {
//     throw new Error(error);
//   }
// };
