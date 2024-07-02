import {
  StyledFullLightGrayBenefit,
  StyledOpenSourceEmblem,
  StyledOpenSourceEmblemWrap,
  StyledOpenSourceSubTitle,
  StyledOpenSourceTitle,
  StyledSubTitleFullBlock,
  StyledTitleFullBlock,
} from "@/components/Pages/Onboarding/components/shared/styled";
import { Box } from "@mui/material";

export const OpenSourceBenefit = () => {
  return (
    <StyledFullLightGrayBenefit>
      <Box>
        <StyledTitleFullBlock>
          Open-source and self-hostable.
        </StyledTitleFullBlock>
        <StyledSubTitleFullBlock>
          Use our high-performance infrastructure to power your website or host
          yourself - all data is on your Nostr relays.
        </StyledSubTitleFullBlock>
      </Box>

      <StyledOpenSourceEmblemWrap>
        <StyledOpenSourceEmblem>
          <StyledOpenSourceSubTitle>
            open source initiative approved license ®
          </StyledOpenSourceSubTitle>
          <StyledOpenSourceTitle>MIT</StyledOpenSourceTitle>
        </StyledOpenSourceEmblem>
      </StyledOpenSourceEmblemWrap>
    </StyledFullLightGrayBenefit>
  );
};
