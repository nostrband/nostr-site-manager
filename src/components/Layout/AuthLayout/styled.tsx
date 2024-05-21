"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledImageAuth = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  position: "relative",
  img: {
    height: "inherit",
    width: "inherit",
    objectFit: "cover",
    position: "absolute",
    left: 0,
    top: 0,
  },
}));

export const StyledWrapper = styled(Box)(() => ({
  position: "relative",
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
  background: "#fff",
}));

export const StyledAuth = styled(Box)(() => ({
  margin: "auto",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
