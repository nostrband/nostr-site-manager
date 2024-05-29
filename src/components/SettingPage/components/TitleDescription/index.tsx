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

interface ITitleDescription extends IBaseSetting {
  title: string;
  description: string;
}

export const TitleDescription = ({
  title,
  description,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingCol id={HASH_CONFIG.TITLE_DESCRIPTION}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Title & Description</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          The details used to identify your publication around the web
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="title">Title</InputLabel>
          <OutlinedInput
            id="title"
            name="title"
            label="Title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="description">Description</InputLabel>
          <OutlinedInput
            id="description"
            name="description"
            label="Description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
