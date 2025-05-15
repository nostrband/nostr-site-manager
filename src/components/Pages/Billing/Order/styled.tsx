"use client";
import { styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import { StyledWrapColumn } from "../styled";

export const StyledWrapPage = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  height: "calc(100% - 50px)",
}));

export const StyledCardHead = styled(Box)(() => ({
  display: "flex",
  gap: "inherit",
  flexDirection: "column",
  textAlign: "center",
  alignItems: "center",
}));

export const StyledCardIcon = styled(Box)(() => ({
  fontSize: 35,
  display: "inline-flex",
}));

export const StyledContainer = styled(Container)(() => ({
  height: "100%",
}));

export const StyledWrap = styled(StyledWrapColumn)(() => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: 0,
  width: 400,
  height: 500,
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    width: "auto",
  },
}));

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    [theme.breakpoints.down("sm")]: {
      margin: 10,
      height: "calc(100% - 20px)",
      maxHeight: "100%",
    },
  },
}));
