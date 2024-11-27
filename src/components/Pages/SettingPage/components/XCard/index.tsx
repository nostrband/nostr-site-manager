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
    <StyledSettingBlock id={HASH_CONFIG.X_CARD}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          X card
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Customize structured data of your site for X (formerly Twitter)
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <StyledFormFields>
        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="xTitle">X Title</InputLabel>
          <OutlinedInput
            id="xTitle"
            name="xTitle"
            label="X Title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </FormControl>

        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="xDescription">X Description</InputLabel>
          <OutlinedInput
            id="xDescription"
            name="xDescription"
            label="X Description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </FormControl>
      </StyledFormFields>
    </StyledSettingBlock>
  );
};
