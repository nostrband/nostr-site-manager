"use client";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { forwardRef } from "react";

export const SpinerWrap = styled(Box)(() => ({
  display: "flex",
  height: "100%",
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
}));

export const SpinerCircularProgress = styled(
  forwardRef<HTMLDivElement, CircularProgressProps>(
    function CircularProgressName(props, ref) {
      return <CircularProgress color="secondary" ref={ref} {...props} />;
    },
  ),
)(() => ({
  margin: "auto",
}));
