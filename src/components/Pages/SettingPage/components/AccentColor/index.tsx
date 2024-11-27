"use client";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";
import { MuiColorInput } from "mui-color-input";
import { memo } from "react";
import useResponsive from "@/hooks/useResponsive";

interface ITitleDescription extends IBaseSetting {
  color: string;
  handleChangeColor: (color: string) => void;
}

export const AccentColor = memo(
  ({ color, handleChangeColor, submitForm, isLoading }: ITitleDescription) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

    const handleClick = () => {
      handleAction().then();
    };

    return (
      <StyledSettingBlock id={SETTINGS_CONFIG.accentColor.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.accentColor.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.accentColor.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <FormControl disabled={!isEdit} fullWidth>
          <MuiColorInput
            fullWidth
            disabled={!isEdit}
            format="hex"
            size={sizeField}
            value={color}
            onChange={handleChangeColor}
          />
        </FormControl>
      </StyledSettingBlock>
    );
  },
);

AccentColor.displayName = "AccentColor";
