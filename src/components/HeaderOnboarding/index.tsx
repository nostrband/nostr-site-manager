"use client";
import {
  StyledHeaderContainer,
  StyledHeaderNavigation,
  StyledHeaderOnboarding,
} from "@/components/HeaderOnboarding/styled";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/services/nostr/nostr";
import LanguageTwoToneIcon from "@mui/icons-material/LanguageTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { usePathname } from "next/navigation";

export const HeaderOnboarding = () => {
  const authed = useContext(AuthContext);
  const pathname = usePathname();

  const isBack = pathname !== "/";

  return (
    <StyledHeaderOnboarding>
      <StyledHeaderContainer maxWidth="lg">
        <Box>
          {isBack && (
            <Button
              LinkComponent={Link}
              href="/"
              color="primary"
              variant="text"
              startIcon={<ArrowBackTwoToneIcon />}
            >
              Back to home
            </Button>
          )}
        </Box>
        <StyledHeaderNavigation>
          <Button
            LinkComponent={Link}
            href="/sites"
            color="primary"
            variant="text"
            endIcon={<LanguageTwoToneIcon />}
          >
            Public sites
          </Button>
          {authed && (
            <Button
              LinkComponent={Link}
              href="/admin"
              color="decorate"
              variant="contained"
            >
              My sites
            </Button>
          )}
        </StyledHeaderNavigation>
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
