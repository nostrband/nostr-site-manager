import React, { memo, useEffect, useRef, useState } from "react";
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
import { SETTINGS_CONFIG } from "@/consts";
import useResponsive from "@/hooks/useResponsive";

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

    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

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
      <StyledSettingBlock id={SETTINGS_CONFIG.titleDescription.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.titleDescription.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.titleDescription.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFormFields>
          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
          </FormControl>

          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
          </FormControl>
        </StyledFormFields>
      </StyledSettingBlock>
    );
  },
);

TitleDescription.displayName = "TitleDescription";
