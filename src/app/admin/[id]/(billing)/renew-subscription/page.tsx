"use client";
import dynamic from "next/dynamic";

const RenewSubscriptionPage = dynamic(
  () => import("../../../../../components/Pages/Billing/RenewSubscription"),
  {
    ssr: false,
  },
);

export default function RenewSubscription() {
  return <RenewSubscriptionPage />;
}
