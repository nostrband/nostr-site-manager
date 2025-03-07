"use client";
import { styled } from "@mui/material/styles";
import { Alert, AlertTitle, Box, Button, IconButton } from "@mui/material";

export const StyledAlert = styled(Alert)(() => ({
  color: "#014361",
  backgroundColor: "#E5F6FD",
  marginBottom: 24,
}));

export const StyledAlertTitle = styled(AlertTitle)(() => ({
  color: "#014361",
}));

export const StyledButtonInfo = styled(IconButton)(() => ({
  fontSize: "24px",
}));

export const StyledFilterActions = styled(Box)(() => ({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
  gap: "24px",
}));

export const StyledAddPostButton = styled(Button)(() => ({
  width: "160px",
}));
