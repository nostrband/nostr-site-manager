import {
  StyledLightBenefit,
  StyledTitleBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import {
  StyledBenefitImgFooter,
  StyledBenefitImgSubTitle,
  StyledBenefitImgTitle,
  StyledWrapImg,
} from "@/components/Pages/Landing/components/SocialBenefit/styled";
import Image from "next/image";
import img from "../../../../../../public/images/onboarding/social-benifit.jpg";

export const SocialBenefit = () => {
  return (
    <StyledLightBenefit>
      <StyledTitleBlock>
        <span>Great for Sharing.</span> Great looking previews on all social
        networks and messaging apps.
      </StyledTitleBlock>

      <StyledWrapImg>
        <Image src={img} alt="Social benefit" priority />
        <StyledBenefitImgFooter>
          <StyledBenefitImgTitle>
            How to show your pug the love he deserves
          </StyledBenefitImgTitle>
          <StyledBenefitImgSubTitle>sam.npub.pro</StyledBenefitImgSubTitle>
        </StyledBenefitImgFooter>
      </StyledWrapImg>
    </StyledLightBenefit>
  );
};
