"use client";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Typography } from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { MuiColorInput } from "mui-color-input";

interface ITitleDescription extends IBaseSetting {
  color: string;
  handleChangeColor: (color: string) => void;
}

export const AccentColor = ({
  color,
  handleChangeColor,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const handleClick = () => {
    handleAction().then();
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.ACCENT_COLOR}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Accent color</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Accent color for theme and PWA
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <MuiColorInput
            fullWidth
            disabled={!isEdit}
            label="Accent color"
            format="hex"
            value={color}
            onChange={handleChangeColor}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
