"use client";
import dynamic from "next/dynamic";

const ConnectionOnboarding = dynamic(
  () => import("../../../../components/Pages/Onboarding/ConnectionOnboarding"),
  {
    ssr: false,
  },
);
export default function ConnectionPage() {
  return <ConnectionOnboarding />;
}
