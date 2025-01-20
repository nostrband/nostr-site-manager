"use client";
import { styled } from "@mui/material/styles";
import { Dialog, DialogContent } from "@mui/material";
import { PageTitle } from "@/components/shared/styled";

export const StyledTitlePage = styled(PageTitle)(() => ({
  display: "flex",
  alignItems: "center",
  paddingBottom: 24,
  gap: 8,
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    wordWrap: "break-word",
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: "16px",
  background: theme.palette.customBackground.light,
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    maxWidth: 720,
    margin: "16px",
    width: "100%",
  },
}));
