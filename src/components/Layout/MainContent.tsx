"use client";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MainWrapper = styled("div")(() => ({
  position: "relative",
  height: "100%",
}));

export const BodyWrapper = styled("body")(({ theme }) => ({
  height: "100%",
  lineHeight: "initial",
  color: "initial",
  background: theme.palette.customBackground.light,
}));

export const StyledWrapCenter = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
