"use client";
import { styled } from "@mui/material/styles";
import { Box, ListItemIcon, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { grey } from "@mui/material/colors";

export const StyledLogo = styled(Box)(() => ({
  width: "34px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}));

export const StyledUser = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
}));

export const StyledUserAvatar = styled(Avatar)(() => ({
  width: 32,
  height: 32,
}));

export const StyledBadgeWrap = styled(Box)(() => ({
  background: grey[100],
  padding: "5px 6px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  borderRadius: "8px",
  height: 34,
  maxWidth: 300,
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const StyledListItemIconDelete = styled(ListItemIcon)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const StyledBadgeAvatar = styled(Avatar)(() => ({
  width: 24,
  height: 24,
  fontSize: "10px",
  background: grey[400],
  borderRadius: "3px",
}));

export const StyledBadgeTitle = styled(Typography)(() => ({
  fontSize: "14px",
  lineHeight: "22px",
  fontWeight: "500",

  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "1",
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
}));
