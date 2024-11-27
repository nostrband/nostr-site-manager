"use client";
import { styled } from "@mui/material/styles";
import { Avatar, Typography, TypographyProps } from "@mui/material";
import { grey } from "@mui/material/colors";
import { forwardRef } from "react";

export const StyledAvatarSite = styled(Avatar)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: 24,
  background: grey[400],
}));

export const PageTitle = styled(
  forwardRef<HTMLDivElement, TypographyProps>(
    function TypographyName(props, ref) {
      return <Typography variant="h1" component="div" ref={ref} {...props} />;
    },
  ),
)(({ theme }) => ({
  fontWeight: "700",
  fontSize: 24,
  lineHeight: "31px",
  [theme.breakpoints.up("sm")]: {
    fontSize: 30,
    lineHeight: "39px",
  },
}));
