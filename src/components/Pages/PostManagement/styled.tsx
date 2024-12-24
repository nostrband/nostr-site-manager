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
