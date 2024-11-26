"use client";
import { styled } from "@mui/material/styles";
import {
  Box,
  TextFieldProps,
  TextField,
  Popper,
  Typography,
  ListSubheader,
} from "@mui/material";
import { forwardRef } from "react";
import { grey } from "@mui/material/colors";

interface ITextField extends Omit<TextFieldProps, "isFocus"> {
  isFocus?: boolean;
}

export const StyledStartIcon = styled(Box)(() => ({
  position: "absolute",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  left: 0,
  bottom: 0,
  width: 50,
}));

export const StyledFormControl = styled(Box)(() => ({
  position: "relative",
  color: "rgba(0, 0, 0, 0.6)",
}));

export const StyledTextField = styled(
  forwardRef<HTMLDivElement, ITextField>(function MainContentName(props, ref) {
    const exclude = new Set(["isFocus"]);

    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <TextField ref={ref} {...omitProps} />;
  }),
)(({ isFocus = false }) => ({
  ".MuiOutlinedInput-input": {
    paddingLeft: isFocus ? "36px" : "14px",
  },
  ".MuiFormLabel-root": {
    color: "rgba(0, 0, 0, 0.6)",
    paddingLeft: isFocus ? "36px" : "0",
  },
}));

export const CustomPopper = styled(Popper)({
  zIndex: "1288 !important",
  "& .MuiPaper-root": {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
  },
  "& .MuiAutocomplete-listbox": {
    paddingTop: 0,
    paddingBottom: 16,
    maxHeight: "70vh",
  },
  "& .MuiAutocomplete-option": {
    '&[aria-selected="true"]': {
      backgroundColor: grey[200],
    },
    "&:hover": {
      backgroundColor: grey[200],
    },
  },
});

export const StyledHighlightWrap = styled("span")(({ theme }) => ({
  color: theme.palette.decorate.main,
}));

export const StyledListItemWrap = styled(Box)(() => ({
  display: "flex",
  gap: "32px",
  alignItems: "center",
  padding: "6px 16px",
}));

export const StyledListItemIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  color: theme.palette.decorate.main,
}));

export const StyledListItemTitle = styled(Typography)(() => ({
  fontSize: "16px",
  lineHeight: "24px",
}));

export const StyledListItemDescription = styled(Typography)(() => ({
  fontSize: "14px",
  lineHeight: "20px",
}));

export const StyledDivider = styled(Box)(() => ({
  padding: "0 16px",
  paddingTop: "16px",
}));

export const StyledListSubheader = styled(ListSubheader)(() => ({
  minHeight: "auto",
  paddingTop: "16px",
  paddingBottom: "16px",
  fontWeight: "700",
  lineHeight: "20px",
  fontSize: "16px",
}));
