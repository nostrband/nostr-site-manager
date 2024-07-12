import React, { useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { InputLabel, OutlinedInput, Typography } from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";

interface IAppName extends IBaseSetting {
  name: string;
}

export const AppName = ({
  name,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: IAppName) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <StyledSettingCol id={HASH_CONFIG.APP_NAME}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">App name</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Short name for your site, displayed when users add it to homescreen
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="app-name">Name</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="app-name"
            name="name"
            label="App name"
            onChange={handleChange}
            value={name}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
