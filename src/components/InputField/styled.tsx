"use client";
import { styled } from "@mui/material/styles";
import { Box, InputLabel, InputLabelProps, FormControl } from "@mui/material";
import { forwardRef } from "react";

interface IInputLabel {
  isFocus: boolean;
  isStartIcon: boolean;
}

export type IStyledInputLabel = IInputLabel & InputLabelProps;

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

export const StyledFormControl = styled(FormControl)(() => ({
  color: "rgba(0, 0, 0, 0.6)",
}));

export const StyledInputLabel = styled(
  forwardRef<HTMLLabelElement, IStyledInputLabel>(
    function InputLabelName(props, ref) {
      const exclude = new Set(["isFocus", "isStartIcon", "isValue"]);

      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <InputLabel ref={ref} {...omitProps} />;
    },
  ),
)(({ isFocus = false, isStartIcon }) => ({
  paddingLeft: isStartIcon ? (isFocus ? "36px" : 0) : 0,
  color: "inherit",
}));
