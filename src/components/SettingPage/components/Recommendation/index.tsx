import React from "react";
import {
  StyledComingSoonProfile,
  StyledComingSoonTitle,
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
          <StyledComingSoonTitle variant="h2">
            <b>Coming soon</b>
          </StyledComingSoonTitle>
        </StyledComingSoonProfile>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
