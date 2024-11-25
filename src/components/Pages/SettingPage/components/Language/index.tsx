import React from "react";
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
    <StyledSettingBlock id={HASH_CONFIG.LANGUAGE}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Publication Language
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Set the language/locale which is used on your site
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <FormControl disabled={!isEdit} fullWidth size="small">
        <InputLabel htmlFor="language">Publication Language</InputLabel>
        <OutlinedInput
          id="language"
          name="language"
          label="Publication Language"
          onChange={handleChange}
          value={language}
          onBlur={handleBlur}
        />
      </FormControl>
    </StyledSettingBlock>
  );
};
