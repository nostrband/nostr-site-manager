import {
  StyledGridItem,
  StyledTitleDescription,
  StyledTitleFAQ,
  StyledWrap,
  StyledTitle,
} from "@/components/Pages/Landing/components/FAQ/styled";
import { Container, Grid } from "@mui/material";
import { Fragment } from "react";
import { FAQ_DATA } from "@/consts";

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
          {FAQ_DATA.map((faq, index) => (
            <Fragment key={index}>
              <Grid item xs={12} sm={6}>
                <StyledTitleFAQ>{faq.question}</StyledTitleFAQ>
              </Grid>
              <StyledGridItem item xs={12} sm={6}>
                <StyledTitleDescription>{faq.answer}</StyledTitleDescription>
              </StyledGridItem>

              {index !== FAQ_DATA.length - 1 && (
                <Grid item xs={12}>
                  <hr />
                </Grid>
              )}
            </Fragment>
          ))}
        </Grid>
      </Container>
    </StyledWrap>
  );
};
