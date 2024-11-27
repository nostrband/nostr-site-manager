import React from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";

interface ISocialAccounts extends IBaseSetting {
  socialAccountFaceBook: string;
  socialAccountX: string;
}

export const SocialAccounts = ({
  socialAccountFaceBook,
  socialAccountX,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ISocialAccounts) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingBlock id={HASH_CONFIG.SOCIAL_ACCOUNTS}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Social accounts
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Link your social accounts for full structured data and rich card
          support
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <StyledFormFields>
        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="socialAccountFaceBook">
            URL of your publication Facebook Page
          </InputLabel>
          <OutlinedInput
            id="socialAccountFaceBook"
            name="socialAccountFaceBook"
            label="URL of your publication's Facebook Page"
            onChange={handleChange}
            value={socialAccountFaceBook}
            onBlur={handleBlur}
          />
        </FormControl>

        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="socialAccountX">
            URL of your X (formerly Twitter) profile
          </InputLabel>
          <OutlinedInput
            id="socialAccountX"
            name="socialAccountX"
            label="URL of your X (formerly Twitter) profile"
            onChange={handleChange}
            value={socialAccountX}
            onBlur={handleBlur}
          />
        </FormControl>
      </StyledFormFields>
    </StyledSettingBlock>
  );
};
