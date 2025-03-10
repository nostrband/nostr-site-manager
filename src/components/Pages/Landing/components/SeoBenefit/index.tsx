import {
  StyledBottomInfo,
  StyledLightBenefit,
  StyledTitleBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import React from "react";
import { StyledIcon } from "@/components/Pages/Landing/components/SeoBenefit/styled";
import { IconSeo } from "@/components/Pages/Landing/components/SeoBenefit/IconSeo";

export const SeoBenefit = () => {
  return (
    <StyledLightBenefit id="icon-seo">
      <StyledBottomInfo>
        <StyledIcon>
          <IconSeo />
        </StyledIcon>
        <StyledTitleBlock>
          <span>SEO-Friendly.</span> Proper Meta Tags and high performance,
          accumulating trust signals to your own domain.
        </StyledTitleBlock>
      </StyledBottomInfo>
    </StyledLightBenefit>
  );
};
