"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography, Grid } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrap = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  paddingBottom: "120px",
  paddingTop: "120px",
  [theme.breakpoints.down("md")]: {
    paddingBottom: "64px",
    paddingTop: "64px",
  },
  hr: {
    margin: 0,
    border: "1px solid #EFEFEF",
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  color: theme.palette.primary.main,
  textAlign: "center",
  fontWeight: "bold",
  fontFamily: InterDisplay.style.fontFamily,
  marginBottom: 64,
  [theme.breakpoints.down("md")]: {
    fontSize: 32,
    marginBottom: 24,
  },
}));

export const StyledTitleFAQ = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  color: theme.palette.primary.main,
  fontWeight: "600",
  [theme.breakpoints.down("md")]: {
    fontSize: 21,
    marginBottom: 8,
  },
}));

export const StyledTitleDescription = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  color: theme.palette.primary.main,
  fontWeight: "400",
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
  },
}));

export const StyledGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    paddingTop: "0 !important",
  },
}));
