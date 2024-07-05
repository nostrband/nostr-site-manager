import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import {
  StyledAppBar,
  StyledIconButton,
  StyledLogo,
  StyledToolbar,
  StyledUser,
  StyledUserAvatar,
} from "@/components/Layout/Header/styled";
import { Logo } from "@/components/Logo";
import React, { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { userPubkey } from "@/services/nostr/nostr";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Typography } from "@mui/material";
import { ModalAuthor } from "@/components/ModalAuthor";

interface IHeader {
  handleOpen: () => void;
  hideSideBar: boolean;
}

export const Header = ({ handleOpen, hideSideBar }: IHeader) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);
  const router = useRouter();
  const pathAdmin = useFirstPathElement();

  const handleClickBackToHome = () => {
    router.push(pathAdmin);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
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
    <StyledAppBar isHideSideBar={!hideSideBar}>
      <StyledToolbar>
        <StyledLogo onClick={handleClickBackToHome}>
          <Logo />
        </StyledLogo>

        <StyledUser>
          {!hideSideBar && (
            <StyledIconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleOpen}
            >
              <MenuTwoToneIcon />
            </StyledIconButton>
          )}

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
          >
            <MenuItem onClick={handleSwitchAccount}>
              <Typography textAlign="left">Switch account</Typography>
            </MenuItem>
            <MenuItem onClick={logout}>
              <Typography textAlign="left">Logout</Typography>
            </MenuItem>
          </Menu>
        </StyledUser>
      </StyledToolbar>
    </StyledAppBar>
  );
};
