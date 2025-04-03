"use client";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/services/nostr/nostr";
import { usePathname } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { ArrowLeftIcon, LoginIcon, WebIcon } from "@/components/Icons";
import { StyledHeaderNavigation } from "./styled";
import { Header } from "@/components/Header";

export const HeaderDiscover = () => {
  const { isAuth } = useContext(AuthContext);
  const pathname = usePathname();
  const isDesktop = useResponsive("up", "sm");

  const isBack = pathname !== "/";

  const handleLogin = () => {
    document.dispatchEvent(new Event("nlLaunch"));
  };

  return (
    <Header>
      <Box>
        {isBack && (
          <Button
            LinkComponent={Link}
            href="/"
            color="secondary"
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
            color="secondary"
            onClick={handleLogin}
            variant="text"
            startIcon={<LoginIcon />}
          >
            Login
          </Button>
        )}
      </StyledHeaderNavigation>
    </Header>
  );
};
