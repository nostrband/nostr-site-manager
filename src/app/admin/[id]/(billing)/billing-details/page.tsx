"use client";
import dynamic from "next/dynamic";

const BillingDetailsPage = dynamic(
  () => import("../../../../../components/Pages/Billing/BillingDetails"),
  {
    ssr: false,
  },
);

export default function BillingDetails() {
  return <BillingDetailsPage />;
}
