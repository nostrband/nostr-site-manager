import React, { useEffect, useRef, useState } from "react";
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
    <StyledSettingCol id={HASH_CONFIG.META_DATA}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Meta data</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Extra content for search engines
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
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
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="metaDescription">Meta description</InputLabel>
          <OutlinedInput
            id="metaDescription"
            name="metaDescription"
            label="Meta description"
            onChange={handleChange}
            value={description}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
