"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const SpinerWrapSites = styled(Box)(() => ({
  display: "flex",
  marginTop: 100,
}));

export const StyledEmptyBlock = styled(Box)(() => ({
  maxWidth: 187,
  margin: "0 auto",
  marginTop: 50,
}));

export const StyledWrapListPosts = styled(Box)(({ theme }) => ({
  paddingTop: "24px",
  paddingBottom: "100px",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "0",
    paddingBottom: "80px",
  },
}));

export const StyledShowMore = styled(Box)(({ theme }) => ({
  marginBottom: "50px",
  maxWidth: 348,
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  padding: 8,
  marginTop: 25,
  [theme.breakpoints.down("md")]: {
    marginBottom: 25,
  },
}));
