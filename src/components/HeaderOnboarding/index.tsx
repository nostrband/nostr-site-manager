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
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import { usePathname } from "next/navigation";

export const HeaderOnboarding = () => {
  const authed = useContext(AuthContext);
  const pathname = usePathname();

  const isBack = pathname !== "/";

  const handleLogin = () => {
    document.dispatchEvent(new Event("nlLaunch"));
  };

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
            startIcon={<LanguageTwoToneIcon />}
          >
            Discover
          </Button>
          {authed ? (
            <Button
              LinkComponent={Link}
              href="/admin"
              color="decorate"
              variant="contained"
              startIcon={<PersonTwoToneIcon />}
            >
              My sites
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              color="primary"
              variant="text"
              startIcon={<LoginTwoToneIcon />}
            >
              Login
            </Button>
          )}
        </StyledHeaderNavigation>
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
