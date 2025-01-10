"use client";
import { styled } from "@mui/material/styles";
import { Badge, Box, Typography } from "@mui/material";
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
}));

export const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-dot": {
    backgroundColor: "#4CAF50",
    height: "6px",
    minWidth: "6px",
    border: "1px solid",
    borderColor: grey[100],
    bottom: "17%",
    right: "20%",
  },
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
}));
