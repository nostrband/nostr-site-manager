import React from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import LoadingButton from "@mui/lab/LoadingButton";

export const DesignBranding = ({
  siteId,
  themeName,
  themeId,
}: {
  siteId: string;
  themeName: string;
  themeId: string;
}) => {
  // FIXME use router
  //  const router = useRouter();

  const switchTheme = () => {
    //    console.log(`/preview?siteId=${siteId}&themeId=${themeId}`);
    window.open(`/preview?siteId=${siteId}&themeId=${themeId}`);
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
            Change theme
          </LoadingButton>
        </StyledHeadSettingBlock>

        <Typography variant="body1">
          Current theme: <b>{themeName}</b>
        </Typography>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
