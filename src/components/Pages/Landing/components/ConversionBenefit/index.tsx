import {
  StyledBottomInfo,
  StyledFullGrayBenefit,
  StyledSubTitleFullBlock,
  StyledTitleFullBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import { StyledWrapImg } from "@/components/Pages/Landing/components/ConversionBenefit/styled";
import Image from "next/image";
import img from "../../../../../../public/images/onboarding/conversion-benefit.png";
import Grid from "@mui/material/Grid";

export const ConversionBenefit = () => {
  return (
    <StyledFullGrayBenefit>
      <Grid container spacing={{ xs: "48px", md: "65px" }}>
        <Grid item xs={12} sm={6}>
          <StyledWrapImg>
            <Image src={img} alt="Conversion benefit" priority />
          </StyledWrapImg>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledBottomInfo>
            <StyledTitleFullBlock>Great for Conversions</StyledTitleFullBlock>
            <StyledSubTitleFullBlock>
              Set up any tool for analytics, lead generation, monetization you
              desire
            </StyledSubTitleFullBlock>
          </StyledBottomInfo>
        </Grid>
      </Grid>
    </StyledFullGrayBenefit>
  );
};
