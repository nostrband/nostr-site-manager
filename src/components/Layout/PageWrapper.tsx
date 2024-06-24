"use client";
import { styled } from "@mui/material/styles";

export const PageWrapper = styled("div")(({ theme }) => ({
  height: "100%",
  padding: 25,
  background: "#fff",
  position: "relative",
  [theme.breakpoints.down("lg")]: {
    padding: 0,
  },
}));
