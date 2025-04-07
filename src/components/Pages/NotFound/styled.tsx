"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledTitlePage = styled(Typography)(({ theme }) => ({
  fontSize: "30px",
  lineHeight: "39px",
  textAlign: "center",
  fontWeight: "700",
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
    lineHeight: "31px",
  },
}));

export const StyledDescriptionPage = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center",
  fontWeight: "400",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    lineHeight: "22px",
  },
}));

export const StyledWrapPage = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  height: "100%",
  gap: "16px",
  alignItems: "center",
  justifyContent: "center",
  padding: 15,
  flexDirection: "column",
}));
