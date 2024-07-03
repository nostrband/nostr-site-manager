"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  // justifyContent: "center",
  padding: "12px 32px",
  position: "fixed",
  flexWrap: "wrap",
  top: 0,
  gap: 16,
  left: 0,
  width: "100%",
  zIndex: 100,
  background: "#fff",
  boxShadow: "0px -1px 16px 0px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("md")]: {
    gap: 10,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px 16px",
  },
}));
