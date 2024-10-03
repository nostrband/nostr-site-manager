"use client";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography } from "@mui/material";

export const StyledListWrap = styled(Box)(() => ({
  marginTop: "40px",
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontSize: 48,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "10px",
  [theme.breakpoints.down("md")]: {
    fontSize: 32,
  },
}));

export const StyledButtonAdd = styled(Button)(({ theme }) => ({
  span: {
    display: "inline-block",
    marginRight: "10px",
  },
  [theme.breakpoints.down("sm")]: {
    minWidth: "auto",
    padding: "6px",
    span: {
      display: "none",
    },
  },
}));
