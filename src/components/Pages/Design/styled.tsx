"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledPreviewTestSite = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "calc(100vh + 100px)",
  position: "relative",
  borderRadius: "16px",
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
