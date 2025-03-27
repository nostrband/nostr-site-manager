"use client";
import dynamic from "next/dynamic";

const MySubscriptionPage = dynamic(
  () => import("../../../../../components/Pages/Billing/MySubscription"),
  {
    ssr: false,
  },
);

export default function MySubscription() {
  return <MySubscriptionPage />;
}
