"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

export const StyledEmptyBlockWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  gap: 16,

  padding: "32px 16px",
  [theme.breakpoints.down("sm")]: {
    padding: "24px 16px",
  },
}));

export const StyledEmptyBlockIcon = styled(Box)(({ theme }) => ({
  svg: {
    height: "64px",
    width: "auto",
    "--secondary": theme.palette.secondary.main,
    "--primary": theme.palette.primary.main,
    [theme.breakpoints.down("sm")]: {
      height: "48px",
    },
  },
}));

export const StyledEmptyBlockText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: 16,
  },
}));
