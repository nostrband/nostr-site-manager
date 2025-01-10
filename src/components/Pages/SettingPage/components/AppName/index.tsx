import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";
import useResponsive from "@/hooks/useResponsive";

interface IAppName extends IBaseSetting {
  name: string;
}

export const AppName = memo(
  ({ name, handleChange, handleBlur, submitForm, isLoading }: IAppName) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDisabled, setDisabled] = useState(false);

    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

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
      <StyledSettingBlock id={SETTINGS_CONFIG.appName.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.appName.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.appName.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <FormControl disabled={!isEdit} fullWidth size={sizeField}>
          <InputLabel htmlFor="app-name">App name</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="app-name"
            name="name"
            label="App name"
            onChange={handleChange}
            value={name}
            onBlur={handleBlur}
          />
        </FormControl>
      </StyledSettingBlock>
    );
  },
);

AppName.displayName = "AppName";
