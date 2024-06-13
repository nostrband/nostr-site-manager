"use client";
import {
  StyledButtonPreview,
  StyledWrapPreview,
} from "@/components/ThemePreview/styled";
import Image, { StaticImageData } from "next/image";

interface IThemePreview {
  preview: StaticImageData;
  id: number;
}

export const ThemePreview = ({ preview, id }: IThemePreview) => {
  return (
    <StyledWrapPreview>
      <StyledButtonPreview color="decorate" variant="contained" size="large">
        Preview
      </StyledButtonPreview>
      <Image
        src={preview}
        alt="Description of image"
        width={500}
        height={500}
      />
    </StyledWrapPreview>
  );
};
