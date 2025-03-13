"use client";
import { styled } from "@mui/material/styles";
import { PageTitle } from "@/components/shared/styled";

export const StyledTitlePage = styled(PageTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingBottom: 24,
  gap: 8,
  paddingTop: 40,
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    wordWrap: "break-word",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: 16,
  },
}));
