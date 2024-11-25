import React, { memo } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { HASH_CONFIG } from "@/consts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";
import { BrushIcon } from "@/components/Icons";
import { StyledText } from "./styled";

export const DesignBranding = memo(
  ({
    siteId,
    themeName,
    themeId,
  }: {
    siteId: string;
    themeName: string;
    themeId: string;
  }) => {
    const router = useRouter();

    const switchTheme = () => {
      router.push(`/design?siteId=${siteId}&themeId=${themeId}`);
    };

    return (
      <StyledSettingBlock id={HASH_CONFIG.DESIGN_BRANDING}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            Theme
            <LoadingButton
              color="decorate"
              variant="text"
              size="medium"
              onClick={switchTheme}
              startIcon={<BrushIcon />}
            >
              Theme settings
            </LoadingButton>
          </StyledTitleBlock>
        </StyledHeadSettingBlock>

        <StyledText variant="body2">
          Current theme: <b>{themeName}</b>
        </StyledText>
      </StyledSettingBlock>
    );
  },
);

DesignBranding.displayName = "DesignBranding";
