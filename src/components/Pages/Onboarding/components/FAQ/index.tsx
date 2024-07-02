import {
  StyledGridItem,
  StyledTitle,
  StyledTitleDescription,
  StyledTitleFAQ,
  StyledWrap,
} from "@/components/Pages/Onboarding/components/FAQ/styled";
import { Container, Grid } from "@mui/material";

export const FAQ = () => {
  return (
    <StyledWrap>
      <Container maxWidth="md">
        <StyledTitle>Questions & Answers</StyledTitle>

        <Grid
          container
          spacing={{ xs: "24px", md: "48px" }}
          rowSpacing={{ xs: "32px" }}
        >
          <Grid item xs={12} sm={6}>
            <StyledTitleFAQ>How does it work?</StyledTitleFAQ>
          </Grid>
          <StyledGridItem item xs={12} sm={6}>
            <StyledTitleDescription>
              Exoplanets, hidden in the vastness, hint at worlds unknown. Each
              one whispers possibilities of alien life and distant shores.
            </StyledTitleDescription>
          </StyledGridItem>

          <Grid item xs={12}>
            <hr />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTitleFAQ>Is it open source?</StyledTitleFAQ>
          </Grid>
          <StyledGridItem item xs={12} sm={6}>
            <StyledTitleDescription>
              The vast cosmos beckons, a tapestry where nebulae dance and stars
              ignite. Every twinkle tells tales of ancient luminance.
            </StyledTitleDescription>
          </StyledGridItem>

          <Grid item xs={12}>
            <hr />
          </Grid>

          <Grid item xs={12} sm={6}>
            <StyledTitleFAQ>What does “npub” mean?</StyledTitleFAQ>
          </Grid>
          <StyledGridItem item xs={12} sm={6}>
            <StyledTitleDescription>
              “npub” is an abbreviation for “nostr public key”, nostr being the
              protocol that is home to your social identity, and the public key
              being your public identity. It helps to visualize this as a
              username handle that everyone can find you by.
            </StyledTitleDescription>
          </StyledGridItem>

          <Grid item xs={12}>
            <hr />
          </Grid>
        </Grid>
      </Container>
    </StyledWrap>
  );
};
