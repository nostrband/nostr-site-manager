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
import { Typography } from "@mui/material";

interface DesignBrandingProps {
  siteId: string;
  themeName: string;
  themeId: string;
  isLoading: boolean;
}

export const DesignBranding = memo(
  ({ siteId, themeName, themeId, isLoading }: DesignBrandingProps) => {
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
              isEdit={isLoading}
              isLoading={isLoading}
              startIcon={<BrushIcon />}
              text="Theme settings"
              handleAction={switchTheme}
            />
          </StyledTitleBlock>
        </StyledHeadSettingBlock>

        <StyledText>
          <Typography component="div" variant="body2">
            Current theme:
          </Typography>
          <Typography component="div" variant="h7">
            {themeName}
          </Typography>
        </StyledText>
      </StyledSettingBlock>
    );
  },
);

DesignBranding.displayName = "DesignBranding";
