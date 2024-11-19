"use client";
import {
  StyledHeaderContainer,
  StyledHeaderNavigation,
  StyledHeaderOnboarding,
} from "@/components/Header/styled";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/services/nostr/nostr";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import { usePathname } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { ArrowLeftIcon, WebIcon } from "../Icons";

export const Header = () => {
  const { isAuth } = useContext(AuthContext);
  const pathname = usePathname();
  const isDesktop = useResponsive("up", "sm");

  const isBack = pathname !== "/";

  const handleLogin = () => {
    document.dispatchEvent(new Event("nlLaunch"));
  };

  return (
    <StyledHeaderOnboarding>
      <StyledHeaderContainer maxWidth={false}>
        <Box>
          {isBack && (
            <Button
              LinkComponent={Link}
              href="/"
              color="primary"
              variant="text"
              sx={{ minWidth: "auto" }}
              startIcon={isDesktop ? <ArrowLeftIcon /> : undefined}
            >
              {isDesktop ? "Back" : <ArrowLeftIcon fontSize="small" />}
            </Button>
          )}
        </Box>
        <StyledHeaderNavigation>
          <Button
            LinkComponent={Link}
            href="/sites"
            color="primary"
            variant="text"
            startIcon={<WebIcon />}
          >
            Discover
          </Button>
          {isAuth ? (
            <Button
              LinkComponent={Link}
              href="/admin"
              color="decorate"
              variant="contained"
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
