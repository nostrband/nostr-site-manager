import React, { useEffect, useRef, useState } from "react";
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

interface IMetaData extends IBaseSetting {
  title: string;
  description: string;
}

export const MetaData = ({
  title,
  description,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: IMetaData) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <StyledSettingBlock id={HASH_CONFIG.META_DATA}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Meta data
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Extra content for search engines
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <StyledFormFields>
        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="metaTitle">Meta title</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="metaTitle"
            name="metaTitle"
            label="Meta title"
            onChange={handleChange}
            value={title}
            onBlur={handleBlur}
          />
        </FormControl>

        <FormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="metaDescription">Meta description</InputLabel>
          <OutlinedInput
            id="metaDescription"
            name="metaDescription"
            label="Meta description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </FormControl>
      </StyledFormFields>
    </StyledSettingBlock>
  );
};
