"use client";
import { styled } from "@mui/material/styles";
import { Container, Typography } from "@mui/material";
import { sourceSerif4 } from "@/mui/theme";

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

export const StyledTypographyCaption = styled(Typography)(({ theme }) => ({
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "21px",
  color: theme.palette.decorate.main,
}));

export const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  fontSize: "56px",
  fontFamily: sourceSerif4.style.fontFamily,
  maxWidth: "860px",
  margin: "auto",
  lineHeight: "124%",
  [theme.breakpoints.down("sm")]: {
    fontSize: "32px",
  },
}));

export const StyledTypographySubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "21px",
  fontWeight: 400,
  lineHeight: "34px",
  [theme.breakpoints.down("sm")]: {
    fontSize: "16px",
  },
}));
