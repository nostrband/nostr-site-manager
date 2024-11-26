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
    <StyledSettingBlock id={HASH_CONFIG.FACEBOOK_CARD}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Facebook card
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Customize structured data of your site
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <StyledFormFields>
        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="fTitle">Facebook title</InputLabel>
          <OutlinedInput
            id="fTitle"
            name="fTitle"
            label="Facebook title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </FormControl>

        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="fDescription">Facebook description</InputLabel>
          <OutlinedInput
            id="fDescription"
            name="fDescription"
            label="Facebook description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </FormControl>
      </StyledFormFields>
    </StyledSettingBlock>
  );
};
