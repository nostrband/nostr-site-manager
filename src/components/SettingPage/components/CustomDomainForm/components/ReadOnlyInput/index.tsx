"use client";

import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const ReadOnlyInput = ({ value }: { value: string }) => {
  const [isCopied, setCopied] = useState(false);

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
    <FormControl>
      <OutlinedInput
        value={value}
        id="outlined-adornment-password"
        type="text"
        disabled
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              disabled={isCopied}
              aria-label="toggle password visibility"
              onClick={handleCopyValue}
              edge="end"
            >
              {isCopied ? (
                <CheckCircleOutlineIcon color="success" fontSize="inherit" />
              ) : (
                <ContentCopyIcon fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
