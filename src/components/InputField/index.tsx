"use client";

import { OutlinedInput, OutlinedInputProps } from "@mui/material";
import { ReactNode, useState } from "react";
import { StyledFormControl, StyledInputLabel, StyledStartIcon } from "./styled";

interface IInputField extends OutlinedInputProps {
  startIcon?: ReactNode;
}

export const InputField = ({
  label,
  id,
  size,
  fullWidth,
  startIcon,
  startAdornment,
  color,
  value,
  ...props
}: IInputField) => {
  const [isFocus, setFocus] = useState(true);
  const isValue =
    typeof value === "string" ? Boolean(value.length) : Boolean(value);
  const isStartIcon =
    !Boolean(startAdornment) && Boolean(startIcon) && !isValue;

  const handleSetFocus = () => {
    setFocus((prev) => !prev);
  };

  return (
    <StyledFormControl
      color={color}
      size={size}
      variant="outlined"
      fullWidth={fullWidth}
    >
      <StyledInputLabel
        isFocus={isFocus}
        isStartIcon={isStartIcon}
        htmlFor={id}
      >
        {label}
      </StyledInputLabel>

      {isStartIcon && isFocus && <StyledStartIcon>{startIcon}</StyledStartIcon>}

      <OutlinedInput
        {...props}
        label={label}
        id={id}
        startAdornment={startAdornment}
        size={size}
        color={color}
        fullWidth={fullWidth}
        value={value}
        onFocus={handleSetFocus}
        onBlur={handleSetFocus}
      />
    </StyledFormControl>
  );
};
