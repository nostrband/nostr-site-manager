"use client";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Card, Typography, TypographyProps } from "@mui/material";
import { grey } from "@mui/material/colors";
import { forwardRef } from "react";

const POST_CARD_PADDING = 16;

export const StyledAvatarSite = styled(Avatar)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: 24,
  background: grey[400],
}));

export const PageTitle = styled(
  forwardRef<HTMLDivElement, TypographyProps>(
    function TypographyName(props, ref) {
      return <Typography variant="h1" component="div" ref={ref} {...props} />;
    },
  ),
)(({ theme }) => ({
  fontWeight: "700",
  fontSize: 24,
  lineHeight: "31px",
  [theme.breakpoints.up("sm")]: {
    fontSize: 30,
    lineHeight: "39px",
  },
}));

export const StyledWrap = styled(Box)(() => ({
  maxWidth: 720,
  margin: "0 auto",
  paddingBottom: "24px",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[0],
  gap: POST_CARD_PADDING,
  padding: POST_CARD_PADDING,
}));

export const StyledCardTitleFeature = styled(Typography)(() => ({
  width: "100%",
  fontWeight: "700",
  fontSize: 20,
  lineHeight: "26px",
}));

export const StyledTitlePage = styled(PageTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingBottom: 24,
  gap: 8,
  paddingTop: 40,
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    paddingTop: 16,
  },
}));

export const StyledWrapOnboardingChildren = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  maxWidth: 348,
  margin: "0 auto",
  alignItems: "center",
}));
