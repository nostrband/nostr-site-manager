"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "../shared/styled";

export const StyledTitle = styled(PageTitle)(({ theme }) => ({
  marginBottom: 34,
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    marginBottom: 24,
  },
}));
