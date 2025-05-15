"use client";
import { styled } from "@mui/material/styles";
import { Box, Button, IconButton } from "@mui/material";
import { ChevronLeftIcon } from "../Icons";

export const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 32px",
  position: "fixed",
  flexWrap: "wrap",
  bottom: 0,
  gap: 16,
  left: 0,
  width: "100%",
  zIndex: 100,
  background: "#fff",
  boxShadow: "0px -1px 16px 0px rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.down("md")]: {
    gap: 10,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "12px 16px",
  },
}));

export const StyledIconButton = styled(IconButton)(() => ({
  border: "1px solid rgba(233, 233, 233, 1)",
}));

export const StyledButtonHashtagKind = styled(Button)(() => ({
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    textWrap: "nowrap",
  },
}));

export const StyledEndIcon = styled(ChevronLeftIcon)(() => ({
  transform: "rotate(-90deg)",
}));
