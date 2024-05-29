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

interface IFCard extends IBaseSetting {
  title: string;
  description: string;
}

export const FCard = ({
  title,
  description,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: IFCard) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingCol id={HASH_CONFIG.FACEBOOK_CARD}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Facebook card</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Customize structured data of your site
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="fTitle">Facebook title</InputLabel>
          <OutlinedInput
            id="fTitle"
            name="fTitle"
            label="Facebook title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="fDescription">Facebook description</InputLabel>
          <OutlinedInput
            id="fDescription"
            name="fDescription"
            label="Facebook description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
