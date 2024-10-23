import React from "react";
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
    <StyledSettingCol id={HASH_CONFIG.SOCIAL_ACCOUNTS}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Social accounts</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Link your social accounts for full structured data and rich card
          support
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
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
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
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
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
