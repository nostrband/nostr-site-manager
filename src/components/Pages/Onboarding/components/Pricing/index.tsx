import {
  StyledCostPrice,
  StyledDescriptionPrice,
  StyledFeatureDescriptionPrice,
  StyledFeaturePrice,
  StyledFeaturePriceGroup,
  StyledIconPrice,
  StyledItem,
  StyledPlanPrice,
  StyledTitle,
  StyledWrap,
} from "@/components/Pages/Onboarding/components/Pricing/styled";
import { Box, Button, Container, Grid } from "@mui/material";
import { IconCheck } from "@/components/Pages/Onboarding/components/Pricing/IconCheck";

export const Pricing = () => {
  return (
    <StyledWrap>
      <Container maxWidth="lg">
        <StyledTitle>Pricing</StyledTitle>

        <Grid container spacing={{ xs: "24px" }} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <StyledItem>
              <StyledPlanPrice>Free</StyledPlanPrice>
              <StyledDescriptionPrice>
                Good for casual publishers
              </StyledDescriptionPrice>
              <StyledCostPrice>$0</StyledCostPrice>
              <Button
                size="large"
                fullWidth
                color="decorate"
                variant="contained"
              >
                Choose a Theme
              </Button>

              <StyledFeaturePriceGroup>
                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Subdomain.</span> Get your own domain.npub.pro
                      subdomain - a short address you can share with your
                      audience.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Some feature.</span> Cosmic dust scatters light,
                      painting auroras and ethereal rainbows across space. These
                      are the universe&apos;s masterpieces.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Some feature.</span> Cosmic dust scatters light,
                      painting auroras and ethereal rainbows across space. These
                      are the universe&apos;s masterpieces.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>
              </StyledFeaturePriceGroup>
            </StyledItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledItem>
              <StyledPlanPrice>Pro</StyledPlanPrice>
              <StyledDescriptionPrice>
                Best for frequent publishers
              </StyledDescriptionPrice>
              <StyledCostPrice>
                $5<small>/mo</small>
              </StyledCostPrice>
              <Button
                size="large"
                fullWidth
                color="decorate"
                variant="contained"
              >
                Choose a Theme
              </Button>

              <StyledFeaturePriceGroup>
                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Custom Domain.</span> Use your own domain and
                      publish from any compatible app.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Some feature.</span> Cosmic dust scatters light,
                      painting auroras and ethereal rainbows across space. These
                      are the universe&apos;s masterpieces.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Some feature.</span> Cosmic dust scatters light,
                      painting auroras and ethereal rainbows across space. These
                      are the universe&apos;s masterpieces.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>
              </StyledFeaturePriceGroup>
            </StyledItem>
          </Grid>
        </Grid>
      </Container>
    </StyledWrap>
  );
};
