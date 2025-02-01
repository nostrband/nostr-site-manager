"use client";
import { ReactNode } from "react";
import { MainWrapper } from "@/components/Layout/MainContent";
import { HeaderAdmin } from "@/components/Layout/HeaderAdmin";
import { StepperOnboarding } from "@/components/StepperOnboarding";
import { Container } from "@mui/material";
import { StyledWrapChildren } from "./styled";

export const OnboardingWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MainWrapper>
      <HeaderAdmin linkToHome="/" isHideActionsUser />
      <StepperOnboarding />

      <Container maxWidth="lg">
        <StyledWrapChildren>{children}</StyledWrapChildren>
      </Container>
    </MainWrapper>
  );
};
