"use client";
import { styled } from "@mui/material/styles";
import { Typography, Grid } from "@mui/material";
import {
  StyledTitleSectionLanding,
  StyledWrapSectionLanding,
} from "../shared/styled";

export const StyledWrap = styled(StyledWrapSectionLanding)(() => ({
  background: "#fff",
  hr: {
    margin: 0,
    border: "1px solid #EFEFEF",
  },
}));

export const StyledTitle = styled(StyledTitleSectionLanding)(({ theme }) => ({
  color: theme.typography.h1.color,
}));

export const StyledTitleFAQ = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: "600",
  lineHeight: "34px",
  [theme.breakpoints.down("md")]: {
    fontSize: 21,
    marginBottom: 8,
  },
}));

export const StyledTitleDescription = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: "400",
  lineHeight: "28px",
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
    lineHeight: "24px",
  },
}));

export const StyledGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: "0 !important",
  },
}));
