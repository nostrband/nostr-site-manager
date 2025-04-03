import {
  StyledBottomInfo,
  StyledFullGrayBenefit,
  StyledSubTitleFullBlock,
  StyledTitleFullBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import { StyledWrapImg } from "@/components/Pages/Landing/components/PopularAppsBenefit/styled";
import Image from "next/image";
import img from "../../../../../../public/images/onboarding/popular-apps.png";
import Grid from "@mui/material/Grid";

export const PopularAppsBenefit = () => {
  return (
    <StyledFullGrayBenefit>
      <Grid container spacing={{ xs: "48px", md: "65px" }}>
        <Grid item xs={12} sm={6}>
          <StyledBottomInfo>
            <StyledTitleFullBlock>
              Use with many popular apps
            </StyledTitleFullBlock>
            <StyledSubTitleFullBlock>
              Your content is automatically compatible with hundreds of apps and
              their audiences.
            </StyledSubTitleFullBlock>
          </StyledBottomInfo>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledWrapImg>
            <Image src={img} alt="Popular Apps" priority />
          </StyledWrapImg>
        </Grid>
      </Grid>
    </StyledFullGrayBenefit>
  );
};
