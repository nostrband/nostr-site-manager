"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";

export const StyledTitle = styled(PageTitle)(({ theme }) => ({
  marginBottom: 24,
  marginTop: 40,
  [theme.breakpoints.down("sm")]: {
    marginTop: 16,
  },
}));
