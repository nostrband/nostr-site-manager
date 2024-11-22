"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";

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
