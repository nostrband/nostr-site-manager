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
} from "@/components/Pages/Landing/components/Pricing/styled";
import { Box, Button, Container, Grid } from "@mui/material";
import { IconCheck } from "@/components/Pages/Landing/components/Pricing/IconCheck";

export const Pricing = () => {
  return (
    <StyledWrap>
      <Container maxWidth="lg">
        <StyledTitle id="pricing">Pricing</StyledTitle>

        <Grid container spacing={{ xs: "24px" }} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <StyledItem>
              <StyledPlanPrice>Free</StyledPlanPrice>
              <StyledDescriptionPrice>Good for starters</StyledDescriptionPrice>
              <StyledCostPrice>0 sats</StyledCostPrice>
              <Button
                size="large"
                fullWidth
                color="decorate"
                variant="contained"
                href="#themes-onboarding"
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
                      <span>Beautiful themes.</span> Compatible with open-source
                      Ghost themes to make your content stand out.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Subdomain.</span> Get your-name.npub.pro domain
                      &mdash; a short address you can share with your audience.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Performance.</span> Your site is served by a global
                      CDN with low latency and 99.9% uptime.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Meta tags & SEO.</span> Up to 1000 latest posts
                      rendered by our server to improve SEO and link sharing
                      experience.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Self-hostable.</span> Download a zip-archive and
                      publish the code of your site to Github Pages or your own
                      server.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>
                {/* 
                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Nostr-Native.</span> Outbox relay model, Blossom and
                      local caching to make your site robust and always
                      available.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice> */}

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Interoperable.</span> Built around the new NIP-512
                      proposal, so that you could switch to a better engine at
                      any time.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>
              </StyledFeaturePriceGroup>
            </StyledItem>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StyledItem>
              <StyledPlanPrice id="pro">Pro</StyledPlanPrice>
              <StyledDescriptionPrice>
                Best for active creators
              </StyledDescriptionPrice>
              <StyledCostPrice>
                9000 sats <small>/mo</small>
              </StyledCostPrice>
              <Button
                size="large"
                fullWidth
                color="decorate"
                variant="contained"
                disabled={true}
              >
                Coming soon
              </Button>

              <StyledFeaturePriceGroup>
                <Box>
                  <StyledFeatureDescriptionPrice>
                    <span>All you get on Free</span> plus:
                  </StyledFeatureDescriptionPrice>
                </Box>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Custom Domain.</span> Switch to your own domain and
                      keep using our scalable infrastructure to host your site.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Higher capacity.</span> Up to 10000 latest posts
                      rendered by our server for longer-term SEO benefits.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Support & customizations.</span> Reach out to
                      discuss any custom theme, plugin or integration that you
                      need for your site.
                    </StyledFeatureDescriptionPrice>
                  </Box>
                </StyledFeaturePrice>

                <StyledFeaturePrice>
                  <StyledIconPrice>
                    <IconCheck />
                  </StyledIconPrice>
                  <Box>
                    <StyledFeatureDescriptionPrice>
                      <span>Fund the ecosystem.</span> Big part of your payments
                      go directly to developers of themes and plugins
                      you&apos;re using.
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
