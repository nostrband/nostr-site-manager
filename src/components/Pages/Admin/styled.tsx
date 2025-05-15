"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";
import { Box, Button } from "@mui/material";

export const StyledTitle = styled(PageTitle)(({ theme }) => ({
  paddingBottom: 24,
  paddingTop: 40,
  [theme.breakpoints.down("sm")]: {
    paddingTop: 16,
  },
}));

export const StyledButtonAdd = styled(Button)(() => ({
  gap: 8,
  position: "relative",
}));

export const StyledButtonAddWrap = styled(Box)(({ theme }) => ({
  position: "fixed",
  padding: 8,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  maxWidth: 348,
  left: 0,
  right: 0,
  marginLeft: "auto",
  marginRight: "auto",
  bottom: 5,
  [theme.breakpoints.down("sm")]: {
    bottom: 0,
    borderRadius: 0,
    maxWidth: "100%",
    padding: "8px 16px",
  },
}));

export const StyledWrapPage = styled(Box)(() => ({
  paddingBottom: 85,
  position: "relative",
}));
