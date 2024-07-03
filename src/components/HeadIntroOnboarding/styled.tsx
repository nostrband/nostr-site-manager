"use client";
import { styled } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledContainerIntro = styled(Container)(({ theme }) => ({
  position: "relative",
  width: "100%",
  marginTop: "120px",
  marginBottom: "120px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  alignItems: "center",
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    marginTop: "70px",
    marginBottom: "70px",
    gap: "22px",
  },
}));

export const StyledLogo = styled(Box)(({ theme }) => ({
  width: "80px",
  [theme.breakpoints.down("sm")]: {
    width: "64px",
  },
}));

export const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  fontSize: "56px",
  fontFamily: InterDisplay.style.fontFamily,
  maxWidth: "860px",
  margin: "auto",
  lineHeight: "124%",
  fontWeight: "700",
  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
  },
}));

export const StyledTypographySubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "21px",
  fontWeight: 400,
  lineHeight: "34px",
  color: "#696F7D",
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
  },
}));
