"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledAutorProfile = styled(Box)(() => ({
  display: "flex",
  gap: 10,
  alignItems: "center",
}));

export const StyledAutorProfileGroup = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 10,
}));
