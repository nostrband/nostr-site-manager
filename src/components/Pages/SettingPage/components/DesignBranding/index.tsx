import React, { memo } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "../../styled";
import { Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import LoadingButton from "@mui/lab/LoadingButton";
import { useRouter } from "next/navigation";

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
      <StyledSettingCol id={HASH_CONFIG.DESIGN_BRANDING}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Theme</Typography>
            <LoadingButton
              color="decorate"
              variant="outlined"
              size="small"
              onClick={switchTheme}
            >
              Theme settings
            </LoadingButton>
          </StyledHeadSettingBlock>

          <Typography variant="body1">
            Current theme: <b>{themeName}</b>
          </Typography>
        </StyledSettingBlock>
      </StyledSettingCol>
    );
  },
);

DesignBranding.displayName = "DesignBranding";
