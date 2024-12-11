"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";
import { Alert, AlertTitle, IconButton } from "@mui/material";

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
  marginBottom: 24
}));

export const StyledAlertTitle = styled(AlertTitle)(() => ({
  color: "#014361",
}));

export const StyledButtonInfo = styled(IconButton)(() => ({
marginLeft: "auto", fontSize: "24px"
}));
