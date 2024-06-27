import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  InputLabel,
  OutlinedInput,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { debounce } from "lodash";

interface ITitleDescription extends IBaseSetting {
  url: string;
}

export const URL = ({
  url,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchAddress, setFetchAddress] = useState(false);

  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  const checkUrlExists = debounce((url: string) => {
    setError(null);
    setFetchAddress(true);
    setTimeout(() => {
      if (true) {
        // Replace with actual condition or mock
        setError("This URL already exists.");
      } else {
        setError(null);
      }
      setFetchAddress(false);
    }, 2000);
  }, 300);

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const handleChangeWithDebounce = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (handleChange) {
      handleChange(event);
    }

    checkUrlExists(value);
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.URL}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Website address</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="url">URL</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="url"
            name="url"
            label="URL"
            onChange={handleChangeWithDebounce}
            value={url}
            onBlur={handleBlur}
            error={!!error}
            endAdornment={
              isFetchAddress ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
          />
          {error && <Typography color="error">{error}</Typography>}
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
