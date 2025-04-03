"use client";
import { styled } from "@mui/material/styles";
import { Alert, AlertTitle, IconButton } from "@mui/material";

export const StyledAlert = styled(Alert)(() => ({
  color: "#014361",
  backgroundColor: "#E5F6FD",
  marginBottom: 24,
}));

export const StyledAlertTitle = styled(AlertTitle)(() => ({
  color: "#014361",
}));

export const StyledButtonInfo = styled(IconButton)(() => ({
  marginLeft: "auto",
  fontSize: "24px",
}));
