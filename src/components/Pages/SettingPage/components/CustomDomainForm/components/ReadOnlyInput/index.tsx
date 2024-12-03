"use client";

import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { CheckCircleIcon, CopyIcon } from "@/components/Icons";

export const ReadOnlyInput = ({
  value,
  label,
  isHideCopy = false,
}: {
  value: string;
  label: string;
  isHideCopy?: boolean;
}) => {
  const [isCopied, setCopied] = useState(false);
  const id = `${label}-${value}`;

  const handleCopyValue = async () => {
    try {
      setCopied(true);

      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy connectionString: ", err);
    } finally {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <FormControl disabled fullWidth size="small">
      <InputLabel htmlFor={id}>{label}</InputLabel>

      <OutlinedInput
        value={value}
        id={id}
        type="text"
        disabled
        label={label}
        multiline={true}
        endAdornment={
          !isHideCopy ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                disabled={isCopied}
                onClick={handleCopyValue}
                edge="end"
              >
                {isCopied ? (
                  <CheckCircleIcon color="success" fontSize="inherit" />
                ) : (
                  <CopyIcon fontSize="inherit" htmlColor="#696F7D" />
                )}
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
};
