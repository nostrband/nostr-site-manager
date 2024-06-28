"use client";
import {
  StyledContainerIntro,
  StyledLogo,
  StyledTypographySubtitle,
  StyledTypographyTitle,
} from "@/components/HeadIntroOnboarding/styled";
import { Button } from "@mui/material";
import { Logo } from "@/components/Logo";

export const HeadIntroOnboarding = () => {
  return (
    <StyledContainerIntro maxWidth="lg">
      <StyledLogo>
        <Logo />
      </StyledLogo>

      <StyledTypographyTitle variant="h1">
        Beautiful nostr-based websites for creators
      </StyledTypographyTitle>

      <StyledTypographySubtitle variant="subtitle1">
        Easy setup. Self-hostable. Just works.
      </StyledTypographySubtitle>

      <Button
        size="large"
        variant="contained"
        color="decorate"
        href="#themes-onboarding"
      >
        <b>Pick a theme to start</b>
      </Button>
    </StyledContainerIntro>
  );
};
