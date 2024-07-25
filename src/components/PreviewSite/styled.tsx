"use client";
import { styled } from "@mui/material/styles";
import { Box, Card, CardActionArea, CardHeader } from "@mui/material";

export const StyledCard = styled(Card)(() => ({
  width: "100%",
  height: "100%",
}));

export const StyledCardActionArea = styled(CardActionArea)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "baseline",
}));

export const StyledCardNoImage = styled(Box)(() => ({
  flex: "0 0 194px",
  background: "#ececec",
  display: "flex",
  height: "194px",
  width: "100%",
}));

export const StyledWrapFooter = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
}));
export const StyledCardHeader = styled(CardHeader)(() => ({
  width: "100%",
  span: {
    width: "inherit",
  },
}));
