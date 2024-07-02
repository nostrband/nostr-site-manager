import {
  StyledTitle,
  StyledWrap,
} from "@/components/Pages/Onboarding/components/Benefits/styled";
import { Container, Grid } from "@mui/material";
import { SocialBenefit } from "@/components/Pages/Onboarding/components/SocialBenefit";
import { SeoBenefit } from "@/components/Pages/Onboarding/components/SeoBenefit";
import { ConversionBenefit } from "@/components/Pages/Onboarding/components/ConversionBenefit";
import { WorksOfflineBenefit } from "@/components/Pages/Onboarding/components/WorksOfflineBenefit";
import { ZeroMaintenanceBenefit } from "@/components/Pages/Onboarding/components/ZeroMaintenanceBenefit";
import { CustomDomain } from "@/components/Pages/Onboarding/components/CustomDomain";
import { OpenSourceBenefit } from "@/components/Pages/Onboarding/components/OpenSourceBenefit";
import { PopularAppsBenefit } from "@/components/Pages/Onboarding/components/PopularAppsBenefit";
import { NativelySocialBenefit } from "@/components/Pages/Onboarding/components/NativelySocialBenefit";
import { BeautifulThemesBenefit } from "@/components/Pages/Onboarding/components/BeautifulThemesBenefit";

export const Benefits = () => {
  return (
    <StyledWrap>
      <Container maxWidth="lg">
        <StyledTitle>Powerful Benefits</StyledTitle>

        <Grid
          container
          spacing={{ xs: "24px", md: "30px" }}
          rowSpacing={{ xs: "24px", md: "64px" }}
        >
          <Grid item xs={12} sm={6}>
            <SocialBenefit />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SeoBenefit />
          </Grid>

          <Grid item xs={12}>
            <ConversionBenefit />
          </Grid>

          <Grid item xs={12}>
            <WorksOfflineBenefit />
          </Grid>

          <Grid item xs={12} sm={6}>
            <ZeroMaintenanceBenefit />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomDomain />
          </Grid>

          <Grid item xs={12}>
            <OpenSourceBenefit />
          </Grid>

          <Grid item xs={12}>
            <BeautifulThemesBenefit />
          </Grid>

          <Grid item xs={12}>
            <NativelySocialBenefit />
          </Grid>

          <Grid item xs={12}>
            <PopularAppsBenefit />
          </Grid>
        </Grid>
      </Container>
    </StyledWrap>
  );
};
