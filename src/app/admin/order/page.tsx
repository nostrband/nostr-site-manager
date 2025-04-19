"use client";
import dynamic from "next/dynamic";

const OrderPage = dynamic(
  () => import("../../../components/Pages/Billing/Order"),
  {
    ssr: false,
  },
);

export default function Order() {
  return <OrderPage />;
}
