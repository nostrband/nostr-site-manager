import {
  StyledFullLightGrayBenefit,
  StyledOpenSourceEmblem,
  StyledOpenSourceEmblemWrap,
  StyledOpenSourceSubTitle,
  StyledOpenSourceTitle,
  StyledSubTitleFullBlock,
  StyledTitleFullBlock,
} from "@/components/Pages/Landing/components/shared/styled";
import { Box } from "@mui/material";

export const OpenSourceBenefit = () => {
  return (
    <StyledFullLightGrayBenefit>
      <Box>
        <StyledTitleFullBlock>
          Open-source and self-hostable.
        </StyledTitleFullBlock>
        <StyledSubTitleFullBlock>
          Use our high-performance infrastructure to power your site or host
          yourself &mdash; all data is on your Nostr relays.
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
