"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
import Image, { StaticImageData } from "next/image";
import { PreviewNavigation } from "@/components/PreviewNavigation";
import { useSearchParams, redirect } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";

export const Preview = () => {
  const params = useSearchParams();
  const themeId = params.get("themeId");
  const previewImg = THEMES_PREVIEW.find((el) => el.id === themeId);

  if (!themeId) {
    return redirect("/");
  }

  return (
    <>
      <StyledPreviewTestSite>
        <Image src={previewImg?.preview as StaticImageData} alt="test site" />
      </StyledPreviewTestSite>

      <PreviewNavigation />
    </>
  );
};
