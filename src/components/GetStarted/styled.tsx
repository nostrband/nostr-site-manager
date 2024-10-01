"use client";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

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
