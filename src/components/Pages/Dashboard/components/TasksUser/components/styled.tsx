"use client";
import { styled } from "@mui/material/styles";
import { Box, BoxProps, Typography } from "@mui/material";
import { forwardRef } from "react";
import { grey } from "@mui/material/colors";

interface StyledWrapProps {
  isCompleted?: boolean;
}

export type IBox = StyledWrapProps & BoxProps;

export const StyledWrap = styled(
  forwardRef<HTMLAnchorElement, IBox>(function StyledWrapName(props, ref) {
    const exclude = new Set(["isCompleted"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isCompleted = false, theme }) => ({
  display: "flex",
  paddingTop: 16,
  alignItems: "center",
  gap: 8,
  borderRadius: theme.shape.borderRadius,
  padding: 16,
  cursor: isCompleted ? "initial" : "pointer",
  background: grey[100],
  transition: "0.3s",
  ":hover": {
    background: isCompleted ? grey[100] : grey[200],
  },
}));

export const StyledIcon = styled(
  forwardRef<HTMLAnchorElement, IBox>(function StyledWrapName(props, ref) {
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
