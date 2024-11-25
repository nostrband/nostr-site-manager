import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFieldIconImage,
  StyledHeadSettingBlock,
  StyledIconImage,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { BrokenIcon } from "@/components/Icons";
import useResponsive from "@/hooks/useResponsive";
import useImageLoader from "@/hooks/useImageLoader";

interface ILogo extends IBaseSetting {
  logo: string;
}

export const Logo = memo(
  ({ logo, handleChange, handleBlur, submitForm, isLoading }: ILogo) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDisabled, setDisabled] = useState(false);

    const { isLoaded } = useImageLoader(logo);

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
      <StyledSettingBlock id={HASH_CONFIG.LOGO}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            Logo
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>Website logo</StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFieldIconImage>
          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
          </FormControl>

          {isLoaded ? (
            <StyledIconImage src={logo} alt="Logo url" />
          ) : (
            <StyledIconImage alt="Logo url" variant="square">
              <BrokenIcon fontSize="inherit" />
            </StyledIconImage>
          )}
        </StyledFieldIconImage>
      </StyledSettingBlock>
    );
  },
);

Logo.displayName = "Logo";
