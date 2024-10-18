import React, { memo, useEffect, useRef, useState } from "react";
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

interface ITitleDescription extends IBaseSetting {
  title: string;
  description: string;
}

export const TitleDescription = memo(
  ({
    title,
    description,
    handleChange,
    handleBlur,
    submitForm,
    isLoading,
  }: ITitleDescription) => {
    const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
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
      <StyledSettingCol id={HASH_CONFIG.TITLE_DESCRIPTION}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Title & Description</Typography>

            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledHeadSettingBlock>

          <Typography variant="body2" sx={{ mb: 1 }}>
            The details used to identify your publication around the web
          </Typography>

          <StyledFormControl disabled={!isEdit} fullWidth size="small">
            <InputLabel htmlFor="title">Title</InputLabel>
            <OutlinedInput
              inputRef={inputRef}
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
              multiline
              rows={5}
              onChange={handleChange}
              value={description}
              onBlur={handleBlur}
            />
          </StyledFormControl>
        </StyledSettingBlock>
      </StyledSettingCol>
    );
  },
);

TitleDescription.displayName = "TitleDescription";
