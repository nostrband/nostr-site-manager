"use client";
import { styled } from "@mui/material/styles";
import { Box, LinearProgress } from "@mui/material";

export const StepperWrap = styled(Box)(({ theme }) => ({
  maxWidth: "515px",
  margin: "40px auto",
  [theme.breakpoints.down("sm")]: {
    marginTop: 16,
  },
}));

export const StepperProgress = styled(LinearProgress)(() => ({
  marginTop: "16px",
}));
