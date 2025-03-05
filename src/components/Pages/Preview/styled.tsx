"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledPreviewTestSite = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  paddingTop: "64px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0px 28px 40.1px 0px #00000026",
}));

export const StyledPreviewTestSiteNotAuth = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  paddingTop: "64px",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0px 28px 40.1px 0px #00000026",
}));
