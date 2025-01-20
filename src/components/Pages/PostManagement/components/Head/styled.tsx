"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";
import { Alert, AlertTitle, Box, Button, IconButton } from "@mui/material";

export const StyledTitle = styled(PageTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingBottom: 24,
  gap: 8,
  paddingTop: 40,
  [theme.breakpoints.down("sm")]: {
    paddingTop: 16,
  },
}));

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
