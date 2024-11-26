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
import { SETTINGS_CONFIG } from "@/consts";
import useResponsive from "@/hooks/useResponsive";
import { BrokenIcon } from "@/components/Icons";
import useImageLoader from "@/hooks/useImageLoader";

interface IIcon extends IBaseSetting {
  icon: string;
}

export const Icon = memo(
  ({ icon, handleChange, handleBlur, submitForm, isLoading }: IIcon) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDisabled, setDisabled] = useState(false);

    const { isLoaded } = useImageLoader(icon);

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
      <StyledSettingBlock id={SETTINGS_CONFIG.icon.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.icon.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.icon.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFieldIconImage>
          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
            <InputLabel htmlFor="icon">Icon url</InputLabel>

            <OutlinedInput
              inputRef={inputRef}
              id="icon"
              name="icon"
              label="Icon url"
              onChange={handleChange}
              value={icon}
              onBlur={handleBlur}
            />
          </FormControl>

          {isLoaded ? (
            <StyledIconImage src={icon} alt="Icon url" />
          ) : (
            <StyledIconImage alt="Icon url" variant="square">
              <BrokenIcon fontSize="inherit" />
            </StyledIconImage>
          )}
        </StyledFieldIconImage>
      </StyledSettingBlock>
    );
  },
);

Icon.displayName = "Icon";
