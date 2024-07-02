import {
  StyledSubTitleFullBlock,
  StyledTitleFullBlock,
} from "@/components/Pages/Onboarding/components/shared/styled";
import {
  StyledWrap,
  StyledWrapImg,
} from "@/components/Pages/Onboarding/components/WorksOfflineBenefit/styled";
import Image from "next/image";
import img from "../../../../../../public/images/onboarding/works-offline.png";
import Grid from "@mui/material/Grid";

export const WorksOfflineBenefit = () => {
  return (
    <StyledWrap>
      <Grid container spacing={{ xs: "48px", md: "65px" }}>
        <Grid item xs={12} sm={6}>
          <StyledTitleFullBlock>Works Offline</StyledTitleFullBlock>
          <StyledSubTitleFullBlock>
            Your website can be added to home screen and works offline for your
            readers&apos; convenience.
          </StyledSubTitleFullBlock>
        </Grid>
        <Grid item xs={12} sm={6}>
          <StyledWrapImg>
            <Image src={img} alt="Conversion benefit" priority />
          </StyledWrapImg>
        </Grid>
      </Grid>
    </StyledWrap>
  );
};
