import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { StyledImgPreview } from "../Image/styled";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import useImageLoader from "@/hooks/useImageLoader";
import useResponsive from "@/hooks/useResponsive";
import { BrokenBigIcon } from "@/components/Icons";

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

    const { isLoaded } = useImageLoader(image);

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
      <StyledSettingBlock id={HASH_CONFIG.IMAGE}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            Image
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>Website cover image</StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
        </FormControl>

        <StyledImgPreview>
          {isLoaded ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt="Image url" src={image} />
          ) : (
            <BrokenBigIcon fontSize="inherit" sx={{ margin: "auto" }} />
          )}
        </StyledImgPreview>
      </StyledSettingBlock>
    );
  },
);

ImageBanner.displayName = "ImageBanner";
