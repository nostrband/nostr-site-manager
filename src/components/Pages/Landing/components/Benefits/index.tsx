import { Container, Grid } from "@mui/material";
import { SocialBenefit } from "@/components/Pages/Landing/components/SocialBenefit";
import { SeoBenefit } from "@/components/Pages/Landing/components/SeoBenefit";
import { ConversionBenefit } from "@/components/Pages/Landing/components/ConversionBenefit";
import { WorksOfflineBenefit } from "@/components/Pages/Landing/components/WorksOfflineBenefit";
import { ZeroMaintenanceBenefit } from "@/components/Pages/Landing/components/ZeroMaintenanceBenefit";
import { CustomDomain } from "@/components/Pages/Landing/components/CustomDomain";
import { OpenSourceBenefit } from "@/components/Pages/Landing/components/OpenSourceBenefit";
import { PopularAppsBenefit } from "@/components/Pages/Landing/components/PopularAppsBenefit";
import { NativelySocialBenefit } from "@/components/Pages/Landing/components/NativelySocialBenefit";
import { BeautifulThemesBenefit } from "@/components/Pages/Landing/components/BeautifulThemesBenefit";
import {
  StyledTitleSectionLanding,
  StyledWrapSectionLanding,
} from "../shared/styled";

export const Benefits = () => {
  return (
    <StyledWrapSectionLanding>
      <Container maxWidth="lg">
        <StyledTitleSectionLanding>Powerful Benefits</StyledTitleSectionLanding>

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
    </StyledWrapSectionLanding>
  );
};
