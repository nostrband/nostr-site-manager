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
import { ArrowLeftIcon, LoginIcon, WebIcon } from "@/components/Icons";
import { usePathname } from "next/navigation";

export const HeaderOnboarding = () => {
  const { isAuth } = useContext(AuthContext);
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
              variant="text"
              color="secondary"
              startIcon={<ArrowLeftIcon />}
            >
              Back
            </Button>
          )}
        </Box>
        <StyledHeaderNavigation>
          <Button
            LinkComponent={Link}
            href="/sites"
            variant="text"
            color="secondary"
            startIcon={<WebIcon />}
          >
            Discover
          </Button>
          {isAuth ? (
            <Button LinkComponent={Link} href="/admin" variant="contained">
              My sites
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              variant="text"
              color="secondary"
              startIcon={<LoginIcon />}
            >
              Login
            </Button>
          )}
        </StyledHeaderNavigation>
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
