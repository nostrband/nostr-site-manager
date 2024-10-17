import React, { memo, useEffect, useRef, useState } from "react";
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
import { StyledImgPreview } from "@/components/SettingPage/components/Image/styled";

interface ITitleDescription extends IBaseSetting {
  image: string;
}

export const ImageBanner = memo(
  ({
    image,
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
      <StyledSettingCol id={HASH_CONFIG.IMAGE}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Image</Typography>

            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledHeadSettingBlock>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Website cover image
          </Typography>

          <StyledFormControl disabled={!isEdit} fullWidth size="small">
            <InputLabel htmlFor="image">Image url</InputLabel>
            <OutlinedInput
              inputRef={inputRef}
              id="image"
              name="image"
              label="Image url"
              onChange={handleChange}
              value={image}
              onBlur={handleBlur}
            />
          </StyledFormControl>
          <StyledImgPreview>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Image url" src={image} />
          </StyledImgPreview>
        </StyledSettingBlock>
      </StyledSettingCol>
    );
  },
);

ImageBanner.displayName = "ImageBanner";
