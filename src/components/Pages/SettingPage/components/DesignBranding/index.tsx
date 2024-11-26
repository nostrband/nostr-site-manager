import React, { memo } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { SETTINGS_CONFIG } from "@/consts";
import { useRouter } from "next/navigation";
import { BrushIcon } from "@/components/Icons";
import { StyledText } from "./styled";
import { SaveButton } from "../SaveButton";

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
      <StyledSettingBlock id={SETTINGS_CONFIG.theme.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.theme.title}

            <SaveButton
              isEdit={false}
              isLoading={false}
              startIcon={<BrushIcon />}
              text="Theme settings"
              handleAction={switchTheme}
            />
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
