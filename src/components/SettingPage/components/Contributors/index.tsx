import React from "react";
import {
  StyledComingSoonProfile,
  StyledComingSoonTitle,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Box, Typography } from "@mui/material";
import { HASH_CONFIG } from "@/consts";
import Avatar from "@mui/material/Avatar";
import { StyledAutorProfile } from "@/components/SettingPage/components/Contributors/styled";

export const Contributors = () => {
  return (
    <StyledSettingCol id={HASH_CONFIG.CONTRIBUTORS}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Contributors</Typography>
        </StyledHeadSettingBlock>

        <StyledAutorProfile>
          <Avatar
            alt="Test name"
            src="https://avatars.githubusercontent.com/u/124499563?s=48&v=4"
          />

          <Box>
            <Typography variant="body1">
              Test name - <b>Owner</b>
            </Typography>
            <Typography variant="body2">testemail@gmail.com</Typography>
          </Box>
        </StyledAutorProfile>

        <StyledComingSoonProfile>
          <StyledComingSoonTitle variant="h2">
            <b>Coming soon</b>
          </StyledComingSoonTitle>
        </StyledComingSoonProfile>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
