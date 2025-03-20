"use client";
import {
  StyledButtonPreview,
  StyledWrapPreview,
} from "@/components/ThemePreview/styled";
import Image, { StaticImageData } from "next/image";
interface IThemePreview {
  preview: StaticImageData;
  handleNavigate: () => void;
  alt?: string;
}

export const ThemePreview = ({
  preview,
  alt = "",
  handleNavigate,
}: IThemePreview) => {
  return (
    <StyledWrapPreview>
      <StyledButtonPreview
        onClick={handleNavigate}
        color="decorate"
        variant="contained"
        size="large"
      >
        Preview
      </StyledButtonPreview>
      <Image src={preview} alt={alt} width={500} height={500} />
    </StyledWrapPreview>
  );
};
