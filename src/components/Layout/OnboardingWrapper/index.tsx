"use client";
import { ReactNode } from "react";
import { MainWrapper } from "@/components/Layout/MainContent";
import { HeaderAdmin } from "@/components/Layout/HeaderAdmin";
import { StepperOnboarding } from "@/components/StepperOnboarding";
import { Container } from "@mui/material";
import { StyledWrapOnboardingChildren } from "@/components/shared/styled";

export const OnboardingWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MainWrapper>
      <HeaderAdmin linkToHome="/" isHideActionsUser />
      <StepperOnboarding />

      <Container maxWidth="lg">
        <StyledWrapOnboardingChildren>{children}</StyledWrapOnboardingChildren>
      </Container>
    </MainWrapper>
  );
};
