"use client";
import { styled } from "@mui/material/styles";
import { Box, InputAdornment, FormControl, Typography } from "@mui/material";
import Link from "next/link";

export const StyledWrap = styled(Box)(() => ({
  maxWidth: 400,
  width: "100%",
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const StyledInputAdornment = styled(InputAdornment)(({ theme }) => ({
  color: theme.palette.primary.dark,
}));

export const StyledSubTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.info.main,
  textDecoration: "none",
}));

export const StyledBottomAuth = styled(Typography)(({ theme }) => ({
  margin: "auto",
  marginTop: theme.spacing(5),
  color: theme.palette.grey.A400,
  textAlign: "center",
  maxWidth: 300,
}));
