"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";
import { Box } from "@mui/material";

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

export const StyledWrapDashboard = styled(Box)(() => ({
  maxWidth: "348px",
  width: "100%",
  margin: "0 auto",
}));

export const StyledActions = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "16px",
}));
