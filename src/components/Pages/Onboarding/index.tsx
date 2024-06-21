"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { HeadIntroOnboarding } from "@/components/HeadIntroOnboarding";
import { ThemesOnboarding } from "@/components/ThemesOnboarding";

export const Onboarding = () => {
  return (
    <>
      <HeaderOnboarding />
      <HeadIntroOnboarding />
      <ThemesOnboarding />
    </>
  );
};
