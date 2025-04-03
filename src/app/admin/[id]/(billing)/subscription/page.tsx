"use client";
import dynamic from "next/dynamic";

const SubscriptionPage = dynamic(
  () => import("../../../../../components/Pages/Billing/Subscription"),
  {
    ssr: false,
  },
);

export default function Subscription() {
  return <SubscriptionPage />;
}
