"use client";
import {
  StyledContainerIntro,
  StyledTypographyCaption,
  StyledTypographySubtitle,
  StyledTypographyTitle,
} from "@/components/HeadIntroOnboarding/styled";
import { Button } from "@mui/material";

export const HeadIntroOnboarding = () => {
  return (
    <StyledContainerIntro maxWidth="lg">
      <StyledTypographyCaption variant="caption" display="block">
        npub.pro
      </StyledTypographyCaption>

      <StyledTypographyTitle variant="h1">
        Create a beautiful nostr-based website in seconds
      </StyledTypographyTitle>

      <StyledTypographySubtitle variant="subtitle1">
        Easy to set up. Self-hostable. Just works.
      </StyledTypographySubtitle>

      <Button variant="contained" color="decorate" href="#themes-onboarding">
        Choose a theme to start
      </Button>
    </StyledContainerIntro>
  );
};
