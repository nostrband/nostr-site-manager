import React from "react";
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

interface ILanguage extends IBaseSetting {
  language: string;
}

export const Language = ({
  language,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ILanguage) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingCol id={HASH_CONFIG.LANGUAGE}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Publication Language</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Set the language/locale which is used on your site
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="language">Publication Language</InputLabel>
          <OutlinedInput
            id="language"
            name="language"
            label="Publication Language"
            onChange={handleChange}
            value={language}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
