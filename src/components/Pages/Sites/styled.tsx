"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { PageTitle } from "@/components/shared/styled";

export const StyledEmptyBlock = styled(Box)(() => ({
  maxWidth: 187,
  margin: "0 auto",
}));

export const SpinerWrapSites = styled(Box)(() => ({
  display: "flex",
}));

export const StyledTitle = styled(PageTitle)(({ theme }) => ({
  marginBottom: 24,
  marginTop: 40,
  [theme.breakpoints.down("sm")]: {
    marginTop: 16,
  },
}));

export const StyledSearchField = styled(Box)(({ theme }) => ({
  marginBottom: 24,
  maxWidth: 600,
  marginLeft: "auto",
  marginRight: "auto",
  [theme.breakpoints.down("md")]: {
    maxWidth: "100%",
  },
}));

export const StyledShowMore = styled(Box)(({ theme }) => ({
  marginBottom: "50px",
  maxWidth: 320,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  padding: 8,
  [theme.breakpoints.down("md")]: {
    marginBottom: 25,
  },
}));

export const StyledWrapListSites = styled(Box)(({ theme }) => ({
  paddingBottom: 50,
  [theme.breakpoints.down("md")]: {
    paddingBottom: 25,
  },
}));
