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
import LanguageTwoToneIcon from "@mui/icons-material/LanguageTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import { usePathname } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { Logo } from "../Logo";

export const HeaderOnboarding = () => {
  const { isAuth } = useContext(AuthContext);
  const pathname = usePathname();
  const isDesktop = useResponsive("up", "sm");

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
            startIcon={<ArrowBackTwoToneIcon />}
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
          color="primary"
          variant="text"
          startIcon={<LanguageTwoToneIcon />}
        >
          Discover
        </Button>
        {isAuth ? (
          <Button
            LinkComponent={Link}
            href="/admin"
            color="decorate"
            variant="contained"
            startIcon={isDesktop ? <PersonTwoToneIcon /> : undefined}
          >
            My sites
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            color="decorate"
            variant="contained"
            size="large"
            startIcon={<LoginTwoToneIcon />}
          >
            Login
          </Button>
        )}
      </StyledHeaderNavigation>
    </StyledHeaderOnboarding>
  );
};
