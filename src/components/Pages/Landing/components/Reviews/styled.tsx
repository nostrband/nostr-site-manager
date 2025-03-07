"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrap = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: "#fff",
  paddingBottom: "120px",
  paddingTop: "120px",
  [theme.breakpoints.down("md")]: {
    paddingBottom: "64px",
    paddingTop: "64px",
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  color: "#fff",
  textAlign: "center",
  fontWeight: "bold",
  fontFamily: InterDisplay.style.fontFamily,
  marginBottom: 64,
  [theme.breakpoints.down("md")]: {
    fontSize: 32,
    marginBottom: 24,
  },
}));
