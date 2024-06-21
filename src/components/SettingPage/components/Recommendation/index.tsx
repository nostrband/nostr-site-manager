import React from "react";
import {
  StyledComingSoonProfile,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
export const Recommendation = () => {
  return (
    <StyledSettingCol id={HASH_CONFIG.RECOMMENDATION}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Recommendation</Typography>
        </StyledHeadSettingBlock>

        <StyledComingSoonProfile>
          <Typography variant="h2">
            <b>Coming soon</b>
          </Typography>
        </StyledComingSoonProfile>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
