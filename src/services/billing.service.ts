import axios from "axios";

const ApiBillingClient = axios.create({
  baseURL: "https://billingapi.npubpro.com",
});

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

ApiBillingClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["X-NpubPro-Token"] = token;
  }
  return config;
});

export const getPrices = async (): Promise<ReturnPriceType[]> => {
  try {
    const res = await ApiBillingClient.get("/prices");

    return res.data.prices;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getInvoices = async (): Promise<ReturnInvoiceType[]> => {
  try {
    const res = await ApiBillingClient.get("/invoices");

    return res.data.invoices;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getServices = async (): Promise<ReturnServiceType[]> => {
  try {
    const res = await ApiBillingClient.get("/services");

    return res.data.services;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getOrders = async (): Promise<ReturnOrderType[]> => {
  try {
    const res = await ApiBillingClient.get("/orders");

    return res.data.orders;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const byPlan = async (siteId: string): Promise<ReturnOrderType> => {
  try {
    const res = await ApiBillingClient.post(`/pro?site=${siteId}`);

    return res.data.order;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const createOrder = async (
  invoices: string[],
): Promise<ReturnOrderType> => {
  try {
    const res = await ApiBillingClient.post(
      `/order?invoices=${invoices.join(",")}`,
    );

    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getOrderById = async (
  orderId: string,
): Promise<ReturnOrderType> => {
  try {
    const res = await ApiBillingClient.get(`/orders?id=${orderId}`);

    console.log(res.data.orders);

    return res.data.orders.find((el: ReturnOrderType) => el.id === orderId);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getBtcUsdCurrencies = async (): Promise<number> => {
  try {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    );

    return res.data.bitcoin.usd;
  } catch (error: any) {
    throw new Error(error);
  }
};
