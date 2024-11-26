import {
  StyledBadge,
  StyledBadgeAvatar,
  StyledBadgeTitle,
  StyledBadgeWrap,
  StyledLogo,
  StyledUser,
  StyledUserAvatar,
} from "./styled";
import { Logo } from "@/components/Logo";
import React, { useContext, useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import {
  AuthContext,
  userIsDelegated,
  userPubkey,
} from "@/services/nostr/nostr";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { useParams, useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Badge, Box, Typography } from "@mui/material";
import { Header } from "@/components/Header";
import { WebIcon } from "@/components/Icons";
import { useListSites } from "@/hooks/useListSites";

export const HeaderLayout = () => {
  const { isAuth } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);
  const router = useRouter();
  const pathAdmin = useFirstPathElement();

  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data } = useListSites();
  const getSite = data?.find((el) => el.id === siteId);

  const handleClickBackToHome = () => {
    router.push(pathAdmin);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (isAuth) {
      setAnchorElUser(event.currentTarget);
    }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logout = () => {
    document.dispatchEvent(new Event("nlLogout"));
    window.location.reload();
  };

  const handleSwitchAccount = () => {
    document.dispatchEvent(new Event("nlLaunch"));
    handleCloseUserMenu();
  };

  const handleConnectKeys = () => {
    document.dispatchEvent(
      new CustomEvent("nlLaunch", { detail: "import-otp" }),
    );
    handleCloseUserMenu();
  };

  useEffect(() => {
    fetchProfiles([userPubkey])
      .then((p) => (p.length ? setAuthor(p[0]) : []))
      .catch(() => setAuthor(undefined));
  }, [userPubkey]);

  let meta = undefined;
  if (author) {
    try {
      meta = JSON.parse(author.content);
    } catch {}
  }

  const npub = nip19.npubEncode(userPubkey).substring(0, 8) + "...";
  const name = meta?.display_name || meta?.name || npub;
  const img = meta?.picture || "";

  return (
    <Header>
      <StyledLogo onClick={handleClickBackToHome}>
        <Logo />
      </StyledLogo>

      {Boolean(siteId && getSite) && (
        <StyledBadgeWrap>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <StyledBadgeAvatar>
              <WebIcon fontSize="inherit" color="inherit" />
            </StyledBadgeAvatar>
          </StyledBadge>

          <StyledBadgeTitle variant="body2">{getSite?.name}</StyledBadgeTitle>
        </StyledBadgeWrap>
      )}

      <StyledUser>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <StyledUserAvatar alt={name} src={img} />
        </IconButton>

        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            sx: {
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          {userIsDelegated && (
            <MenuItem onClick={handleConnectKeys}>
              <Typography textAlign="left">Connect keys</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={handleSwitchAccount}>
            <Typography textAlign="left">Switch account</Typography>
          </MenuItem>
          <MenuItem onClick={logout}>
            <Typography textAlign="left">Logout</Typography>
          </MenuItem>
        </Menu>
      </StyledUser>
    </Header>
  );
};
