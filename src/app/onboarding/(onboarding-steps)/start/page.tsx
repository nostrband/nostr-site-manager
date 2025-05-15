"use client";
import dynamic from "next/dynamic";

const StartOnboarding = dynamic(
  () => import("../../../../components/Pages/Onboarding/StartOnboarding"),
  {
    ssr: false,
  },
);

export default function StartPage() {
  return <StartOnboarding />;
}
