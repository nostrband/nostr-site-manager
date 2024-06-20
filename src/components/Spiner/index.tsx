"use client";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const SpinerWrap = styled(Box)(() => ({
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
}));

export const SpinerCircularProgress = styled(CircularProgress)(() => ({
  margin: "auto",
}));
