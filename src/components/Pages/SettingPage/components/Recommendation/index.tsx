import React from "react";
import {
  StyledComingSoonProfile,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { HASH_CONFIG } from "@/consts";
export const Recommendation = () => {
  return (
    <StyledSettingBlock id={HASH_CONFIG.RECOMMENDATION}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>Recommendation</StyledTitleBlock>
      </StyledHeadSettingBlock>

      <StyledComingSoonProfile>Coming soon</StyledComingSoonProfile>
    </StyledSettingBlock>
  );
};
