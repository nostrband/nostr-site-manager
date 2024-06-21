"use client";
import {
  StyledButtonPreview,
  StyledWrapPreview,
} from "@/components/ThemePreview/styled";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import { TYPES_THEMES_TAG } from "@/consts";

interface IThemePreview {
  preview: StaticImageData;
  id: string;
  tag: TYPES_THEMES_TAG | null;
}

export const ThemePreview = ({ preview, id, tag }: IThemePreview) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/preview?themeId=${id}${tag ? `&tag=${tag}` : ""}`);
  };

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
      <Image
        src={preview}
        alt="Description of image"
        width={500}
        height={500}
      />
    </StyledWrapPreview>
  );
};
