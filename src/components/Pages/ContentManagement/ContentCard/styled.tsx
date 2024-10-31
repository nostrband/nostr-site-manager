"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const BrokenImage = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 240,
  width: "100%",
  backgroundColor: "#ececec",
}));

export const DescriptionPost = styled(Typography)(() => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  WebkitLineClamp: 2,
  textOverflow: "ellipsis",
  maxWidth: "100%",
  width: "100%",
}));
