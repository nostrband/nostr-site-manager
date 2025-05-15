"use client";
import dynamic from "next/dynamic";

const CreateSiteOnboarding = dynamic(
  () => import("../../../../components/Pages/Onboarding/CreateSiteOnboarding"),
  {
    ssr: false,
  },
);
export default function CreateSitePage() {
  return <CreateSiteOnboarding />;
}
