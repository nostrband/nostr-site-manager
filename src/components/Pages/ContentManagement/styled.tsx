"use client";
import { styled } from "@mui/material/styles";
import { Box, Typography, Avatar } from "@mui/material";

export const GroupContributors = styled(Box)(() => ({
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 40,
  alignItems: "center",
}));

export const AvatarContributor = styled(Avatar)(() => ({
  backgroundColor: "#9ec4d1",
}));

export const AvatarAuthor = styled(Avatar)(() => ({
  backgroundColor: "#9ec4d1",
  marginRight: 10,
}));

export const TitleSection = styled(Typography)(() => ({
  fontWeight: "bold",
  marginBottom: 15,
}));

export const TitleSiteName = styled(Typography)(() => ({
  fontWeight: "bold",
}));
