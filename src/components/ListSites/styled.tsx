"use client";
import { styled } from "@mui/material/styles";
import { Button, Grid } from "@mui/material";

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

export const StyledGrid = styled(Grid)(() => ({
  width: "100%",
  marginTop: "40px",
}));
