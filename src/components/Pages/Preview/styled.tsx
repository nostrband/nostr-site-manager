"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledPreviewTestSite = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  paddingBottom: "74px",
  [theme.breakpoints.down("sm")]: {
    paddingBottom: "127px",
  },
  position: "relative",
  overflow: "hidden",
  boxShadow: "0px 28px 40.1px 0px #00000026",
  img: {
    height: "inherit",
    width: "inherit",
    objectFit: "cover",
    position: "absolute",
    left: 0,
    top: 0,
  },
}));
