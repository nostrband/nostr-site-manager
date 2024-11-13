import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "../../styled";
import { InputLabel, OutlinedInput, Typography } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { StyledIconPreview } from "../Icon/styled";

interface ILogo extends IBaseSetting {
  logo: string;
}

export const Logo = memo(
  ({ logo, handleChange, handleBlur, submitForm, isLoading }: ILogo) => {
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
      <StyledSettingCol id={HASH_CONFIG.LOGO}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Logo</Typography>

            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledHeadSettingBlock>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Website logo
          </Typography>

          <StyledFormControl disabled={!isEdit} fullWidth size="small">
            <InputLabel htmlFor="icon">Logo url</InputLabel>
            <OutlinedInput
              inputRef={inputRef}
              id="logo"
              name="logo"
              label="Logo url"
              onChange={handleChange}
              value={logo}
              onBlur={handleBlur}
            />
          </StyledFormControl>
          <StyledIconPreview>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Logo url" src={logo} />
          </StyledIconPreview>
        </StyledSettingBlock>
      </StyledSettingCol>
    );
  },
);

Logo.displayName = "Logo";
