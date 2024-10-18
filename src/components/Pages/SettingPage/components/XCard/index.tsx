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

interface IXCard extends IBaseSetting {
  title: string;
  description: string;
}

export const XCard = ({
  title,
  description,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: IXCard) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingCol id={HASH_CONFIG.X_CARD}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">X card</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Customize structured data of your site for X (formerly Twitter)
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="xTitle">X Title</InputLabel>
          <OutlinedInput
            id="xTitle"
            name="xTitle"
            label="X Title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="xDescription">X Description</InputLabel>
          <OutlinedInput
            id="xDescription"
            name="xDescription"
            label="X Description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
