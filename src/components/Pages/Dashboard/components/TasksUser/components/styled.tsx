"use client";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
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
  forwardRef<HTMLAnchorElement, IIcon>(function IconName(props, ref) {
    const exclude = new Set(["isCompleted"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isCompleted = false, theme }) => ({
  display: "flex",
  color: isCompleted ? theme.palette.success.main : theme.palette.primary.main,
}));

export const StyledIconChevron = styled(Box)(() => ({
  transform: "rotate(180deg)",
  display: "flex",
  color: "#696F7D",
}));

export const StyledActions = styled(Box)(() => ({
  marginLeft: "auto",
  display: "flex",
  gap: 8,
  alignItems: "center",
}));
