"use client";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

export const StyledWrapPreview = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "280px",
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0px 28px 40.1px 0px #00000026",
  img: {
    height: "inherit",
    width: "inherit",
    objectFit: "cover",
    objectPosition: "left top",
    position: "absolute",
    left: 0,
    top: 0,
  },
  "&:hover::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  button: {
    display: "none",
  },
  "&:hover": {
    button: {
      display: "block",
    },
  },
}));

export const StyledButtonPreview = styled(Button)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: "174px",
  width: "100%",
}));
