"use client";
import { styled } from "@mui/material/styles";
import { Avatar, Box, Divider, Typography } from "@mui/material";
import { ChevronLeftIcon } from "@/components/Icons";

export const StyledTitlePage = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "24px",
    lineHeight: "31px",
  },
}));

export const StyledDescriptionPage = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  [theme.breakpoints.down("sm")]: {
    fontSize: "14px",
    lineHeight: "22px",
  },
}));

export const StyledActions = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  gap: "16px",
  justifyContent: "space-between",
}));

export const StyledVideo = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  width: "100%",

  video: {
    width: "inherit",
    verticalAlign: "middle",
  },
}));

export const StyledWrapAuthors = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: theme.shape.borderRadius,
  padding: "16px",
  width: "100%",
}));

export const StyledAuthor = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: theme.shape.borderRadius,
  padding: "8px",
  cursor: "pointer",
  alignItems: "center",
  display: "flex",
  width: "100%",
  gap: "16px",
  ":hover": {
    background: "#696F7D0A",
  },
}));

export const StyledAuthorChoose = styled(Box)(() => ({
  alignItems: "center",
  display: "flex",
  width: "100%",
  gap: "16px",
  padding: "8px",
  marginBottom: "8px",
}));

export const StyledChevronRightIcon = styled(ChevronLeftIcon)(() => ({
  marginLeft: "auto",
  transform: "rotate(180deg)",
  color: "#696F7D",
}));

export const StyledChevronLeftIcon = styled(ChevronLeftIcon)(() => ({
  color: "#696F7D",
  cursor: "pointer",
}));

export const StyledAuthorAvatar = styled(Avatar)(() => ({
  height: "40px",
  width: "40px",
}));

export const StyledAuthorText = styled(Typography)(() => ({
  marginBottom: "16px",
  textAlign: "center",
}));

export const StyledDivider = styled(Divider)(() => ({
  marginTop: "8px",
  marginBottom: "8px",
}));
