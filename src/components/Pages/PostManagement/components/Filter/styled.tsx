"use client";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  ButtonProps,
  DialogContent,
  FormControl,
  InputLabel,
  Popper,
  Select,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";

interface ICollapseButton {
  isOpenMoreFilter?: boolean;
}

export type IICollapseButtonFilter = ICollapseButton & ButtonProps;

export const StyledWrapFilter = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
}));

export const StyledTitleFilter = styled(Typography)(({ theme }) => ({
  fontSize: 24,
  fontWeight: "700",
  lineHeight: "31px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
  [theme.breakpoints.up("sm")]: {
    fontSize: 16,
    lineHeight: "20px",
    justifyContent: "space-between",
  },
}));

export const StyledCollapseButtonFilter = styled(
  forwardRef<HTMLButtonElement, IICollapseButtonFilter>(
    function MainContentName(props, ref) {
      const exclude = new Set(["isOpenMoreFilter"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <Button ref={ref} {...omitProps} />;
    },
  ),
)(({ isOpenMoreFilter, theme }) => ({
  ".collapseButtonIcon": {
    transform: `${isOpenMoreFilter ? "rotate(90deg)" : "rotate(-90deg)"}`,
    transition: "0.3s",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export const StyledCloseFilterButton = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  [theme.breakpoints.up("sm")]: {
    display: "none",
  },
}));

export const StyledFormControl = styled(FormControl)(() => ({
  color: "rgba(0, 0, 0, 0.6)",
}));

export const StyledFormControlLabel = styled(InputLabel)(() => ({
  color: "inherit",
}));

export const StyledWrapField = styled(Box)(({ theme }) => ({
  paddingTop: "16px",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "24px",
  },
}));

export const StyledDialogContent = styled(DialogContent)({
  padding: 0,
  paddingTop: "50px",
});

export const StyledActionsButtonWrap = styled(Box)(({ theme }) => ({
  position: "fixed",
  padding: 8,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  maxWidth: 348,
  left: 0,
  right: 0,
  marginLeft: "auto",
  marginRight: "auto",
  bottom: 5,
  display: "flex",
  alignItems: "center",
  gap: "16px",
  zIndex: "1",
  [theme.breakpoints.down("sm")]: {
    bottom: 0,
    borderRadius: 0,
    maxWidth: "100%",
    padding: "8px 16px",
  },
}));
