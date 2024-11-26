"use client";
import { styled } from "@mui/material/styles";
import { Box, Button, Typography, TypographyProps } from "@mui/material";

export const StyledItemNavigation = styled(Box)({
  display: "flex",
  gap: 8,
  height: 68,
  alignItems: "center",
  justifyContent: "space-between",
  color: "#696F7D",
});

export const StyledNavigationWrap = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const StyledButtonAction = styled(Button)({
  minWidth: "auto",
  color: "inherit",
});

export const StyledActions = styled(Box)({
  display: "flex",
  gap: 8,
});

export const StyledInfoNavigation = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const StyledTitleNavigation = styled(Typography)({
  fontSize: 16,
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  lineHeight: "24px",
});

export const StyledLinkNavigation = styled((props: TypographyProps) => {
  return <Typography variant="body2" {...props} />;
})({
  fontSize: 14,
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  lineHeight: "20px",
});
