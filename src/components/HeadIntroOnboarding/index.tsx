"use client";
import {
  StyledContainerIntro,
  StyledTypographyCaption,
  StyledTypographySubtitle,
  StyledTypographyTitle,
} from "@/components/HeadIntroOnboarding/styled";

export const HeadIntroOnboarding = () => {
  return (
    <StyledContainerIntro maxWidth="lg">
      <StyledTypographyCaption variant="caption" display="block">
        WEBSTR
      </StyledTypographyCaption>

      <StyledTypographyTitle variant="h1">
        Create beautiful nostr-based websites in seconds
      </StyledTypographyTitle>

      <StyledTypographySubtitle variant="subtitle1">
        Your nostr content in a beautiful website format, automatically.
      </StyledTypographySubtitle>
    </StyledContainerIntro>
  );
};
