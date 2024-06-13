"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
import img from "../../../../public/images/preview-theme/preview.png";
import Image from "next/image";
import { PreviewNavigation } from "@/components/PreviewNavigation";

export const Preview = () => {
  return (
    <>
      <StyledPreviewTestSite>
        <Image src={img} alt="test site" />
      </StyledPreviewTestSite>

      <PreviewNavigation />
    </>
  );
};
