"use client";
import {
  StyledHeaderNavigation,
  StyledHeaderOnboarding,
  StyledLogo,
} from "@/components/HeaderOnboarding/styled";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/services/nostr/nostr";
import {
  ArrowLeftIcon,
  LoginIcon,
  WebIcon,
  IconPerson,
} from "@/components/Icons";
import { usePathname } from "next/navigation";
import { Logo } from "../Logo";

export const HeaderOnboarding = () => {
  const { isAuth } = useContext(AuthContext);
  const pathname = usePathname();

  const isBack = pathname !== "/";

  const handleLogin = () => {
    document.dispatchEvent(new Event("nlLaunch"));
  };

  return (
    <StyledHeaderOnboarding>
      <Box>
        {isBack ? (
          <Button
            LinkComponent={Link}
            href="/"
            color="primary"
            variant="text"
            startIcon={<ArrowLeftIcon />}
          >
            Back
          </Button>
        ) : (
          <StyledLogo>
            <Logo />
          </StyledLogo>
        )}
      </Box>

      <StyledHeaderNavigation>
        <Button
          LinkComponent={Link}
          href="/sites"
          color="secondary"
          variant="text"
          startIcon={<WebIcon />}
        >
          Discover
        </Button>
        {isAuth ? (
          <Button
            LinkComponent={Link}
            href="/admin"
            variant="contained"
            startIcon={<IconPerson />}
          >
            My sites
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        )}
      </StyledHeaderNavigation>
    </StyledHeaderOnboarding>
  );
};
