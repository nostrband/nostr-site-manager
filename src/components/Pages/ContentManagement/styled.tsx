"use client";
import { styled } from "@mui/material/styles";
import {
  Box,
  Fab,
  InputLabel,
  TextField,
  Typography,
  Select,
  Avatar,
} from "@mui/material";

export const GroupContributors = styled(Box)(() => ({
  display: "flex",
  gap: 20,
  flexWrap: "wrap",
  marginBottom: 40,
}));

export const AvatarContributor = styled(Avatar)(() => ({
  backgroundColor: "#9ec4d1",
  cursor: "pointer",
}));

export const AvatarAuthor = styled(Avatar)(() => ({
  backgroundColor: "#9ec4d1",
  marginRight: 10,
}));

export const TitleSection = styled(Typography)(() => ({
  fontWeight: "bold",
  marginBottom: 15,
}));
