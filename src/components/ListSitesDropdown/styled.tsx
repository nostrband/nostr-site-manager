"use client";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box } from "@mui/material";

export const StyledLoadingButton = styled(LoadingButton)(() => ({
  textTransform: "none",
}));

export const StyledWarpperActions = styled(Box)(() => ({
  display: "flex",
  gap: 20,
  width: "100",
}));
