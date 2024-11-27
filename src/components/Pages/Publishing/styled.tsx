"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledWrap = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  padding: 15,
  background: "#fff",
}));

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  fontSize: 24,
  marginTop: 16,
  marginBottom: 16,
  textAlign: "center",
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  marginBottom: 16,
  maxWidth: 470,
  textAlign: "center",
  a: {
    textDecoration: "none",
    color: theme.palette.decorate.main,
  },
}));
