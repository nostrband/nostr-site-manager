import React from "react";
import {
  StyledComingSoonProfile,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { SETTINGS_CONFIG } from "@/consts";
export const Recommendation = () => {
  return (
    <StyledSettingBlock id={SETTINGS_CONFIG.recommendations.anchor}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          {SETTINGS_CONFIG.recommendations.title}
        </StyledTitleBlock>
      </StyledHeadSettingBlock>

      <StyledComingSoonProfile variant="subtitle4">
        Coming soon
      </StyledComingSoonProfile>
    </StyledSettingBlock>
  );
};
