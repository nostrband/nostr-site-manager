import { OnboardingWrapper } from "@/components/Layout/OnboardingWrapper";

export const metadata = {
  title: "Npub.pro | Onboarding",
  description: "",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingWrapper>{children}</OnboardingWrapper>;
}
