"use client";
import { styled } from "@mui/material/styles";
import { Box, BoxProps, Typography } from "@mui/material";
import { forwardRef } from "react";
import { grey } from "@mui/material/colors";

interface IconProps {
  isCompleted?: boolean;
}

export type IIcon = IconProps & BoxProps;

export const StyledWrap = styled(Box)(({ theme }) => ({
  display: "flex",
  paddingTop: 16,
  alignItems: "center",
  gap: 8,
  borderRadius: theme.shape.borderRadius,
  padding: 16,
  cursor: "pointer",
  background: grey[100],
  transition: "0.3s",
  ":hover": {
    background: grey[200],
  },
}));

export const StyledIcon = styled(
  forwardRef<HTMLAnchorElement, IIcon>(function StyledWrapName(props, ref) {
    const exclude = new Set(["isCompleted"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isCompleted = false, theme }) => ({
  display: "flex",
  color: isCompleted ? theme.palette.success.main : theme.palette.decorate.main,
}));

export const StyledText = styled(Typography)(() => ({
  fontWeight: "600",
  lineHeight: "20px",
  fontSize: 14,
}));

export const StyledIconChevron = styled(Box)(() => ({
  transform: "rotate(180deg)",
  display: "flex",
  marginLeft: "auto",
  color: "#696F7D",
}));
