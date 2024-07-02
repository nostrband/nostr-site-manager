import {
  StyledLightBenefit,
  StyledTitleBlock,
} from "@/components/Pages/Onboarding/components/shared/styled";
import {
  StyledGroupDomain,
  StyledImgDomain,
  StyledTextDomain,
  StyledTextDomainDark,
  StyledWrapDomain,
  StyledWrapDomainDark,
} from "@/components/Pages/Onboarding/components/CustomDomain/styled";
import Image from "next/image";
import img from "../../../../../../public/images/onboarding/user.jpg";

export const CustomDomain = () => {
  return (
    <StyledLightBenefit id="icon-zero-maintenance">
      <StyledTitleBlock>
        <span>Custom Domain.</span> Start with a free npub.pro subdomain, and
        upgrade to use your own any time.
      </StyledTitleBlock>

      <StyledGroupDomain>
        <StyledWrapDomain>
          <StyledImgDomain>
            <Image src={img} alt="User avatar" priority />
          </StyledImgDomain>
          <StyledTextDomain>janewrites.com</StyledTextDomain>
        </StyledWrapDomain>

        <StyledWrapDomainDark>
          <StyledImgDomain>
            <Image src={img} alt="User avatar" priority />
          </StyledImgDomain>
          <StyledTextDomainDark>jane.npub.pro</StyledTextDomainDark>
        </StyledWrapDomainDark>
      </StyledGroupDomain>
    </StyledLightBenefit>
  );
};
