"use client";
import { styled } from "@mui/material/styles";
import { Button, Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledButton = styled(Button)(() => ({
  borderRadius: "1000px",
  textTransform: "none",
}));

export const StyledButtonGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  width: "100%",
  justifyContent: "center",
  gap: 16,
  marginBottom: 64,
  flexWrap: "wrap",
  zIndex: 2,
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    gap: 10,
    marginBottom: 32,
  },
}));

export const StyledPreviews = styled(Box)(({ theme }) => ({
  paddingBottom: 48,
  zIndex: 2,
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: 32,
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  textAlign: "center",
  fontWeight: "bold",
  fontFamily: InterDisplay.style.fontFamily,
  marginBottom: 64,
  [theme.breakpoints.down("md")]: {
    fontSize: 32,
    marginBottom: 24,
  },
}));
