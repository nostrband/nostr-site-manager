"use client";
import {
  StyledBadgeAvatar,
  StyledBadgeTitle,
  StyledBadgeWrap,
  StyledListItemIcon,
  StyledListItemIconDelete,
  StyledUser,
  StyledUserAvatar,
} from "./styled";
import React, { useContext, useEffect, useRef, useState } from "react";
import { nip19 } from "nostr-tools";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { ListItemText } from "@mui/material";
import {
  BrokenIcon,
  BrushIcon,
  DashboardIcon,
  FIleTextIcon,
  IconLink,
  MoreIcon,
  SettingsIcon,
  TrashIcon,
} from "@/components/Icons";
import { useListSites } from "@/hooks/useListSites";
import useImageLoader from "@/hooks/useImageLoader";
import { useGetSiteId } from "@/hooks/useGetSiteId";
import Link from "next/link";
import { ModalConfirmDeleteSite } from "@/components/ModalConfirmDeleteSite";
import { useRouter } from "next/navigation";
import { getLinksMenu } from "@/utils";

export const ActionsUser = () => {
  const { isAuth } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isOpenMenuSite, setOpenSite] = useState(false);
  const router = useRouter();
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);
  const [isOpenConfirm, setOpenConfirm] = useState(false);

  const badgeRef = useRef<HTMLElement>(null);

  const { siteId } = useGetSiteId();
  const { data } = useListSites();
  const getSite = data?.find((el) => el.id === siteId);

  const userIsAdmin =
    userPubkey && getSite && getSite.adminPubkey === userPubkey;

  const { linkToDashboard, linkSwitchTheme, linkSettings, linkPostManagement } =
    getLinksMenu(siteId, getSite?.themeId);

  const { isLoaded } = useImageLoader(getSite ? getSite.icon : "");

  const handeOpenConfirm = () => {
    setOpenConfirm(true);
    handleCloseMenuSite();
  };

  const handeCloseConfirm = (deleted: boolean) => {
    setOpenConfirm(false);
    if (deleted) router.push(`/admin`);
  };

  const handleOpenMenuSite = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setOpenSite(true);
  };

  const handleCloseMenuSite = () => {
    setOpenSite(false);
  };

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    if (isAuth) {
      setAnchorElUser(e.currentTarget);
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
    <>
      {Boolean(siteId && getSite) && (
        <Link href={linkToDashboard}>
          <StyledBadgeWrap ref={badgeRef}>
            {isLoaded ? (
              <StyledBadgeAvatar variant="square" src={getSite?.icon}>
                {getSite?.title[0]}
              </StyledBadgeAvatar>
            ) : (
              <StyledBadgeAvatar variant="square">
                <BrokenIcon fontSize="inherit" />
              </StyledBadgeAvatar>
            )}

            <StyledBadgeTitle variant="body2">
              {getSite?.title}
            </StyledBadgeTitle>

            <IconButton onClick={handleOpenMenuSite} size="small">
              <MoreIcon fontSize="inherit" />
            </IconButton>
          </StyledBadgeWrap>
        </Link>
      )}

      <StyledUser>
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <StyledUserAvatar alt={name} src={img} />
        </IconButton>

        <Menu
          sx={{ mt: "45px" }}
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
            <ListItemText>Switch account</ListItemText>
          </MenuItem>
          <MenuItem onClick={logout}>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </StyledUser>

      <ModalConfirmDeleteSite
        isOpen={isOpenConfirm}
        siteId={siteId}
        handleClose={handeCloseConfirm}
      />

      <Menu
        sx={{ mt: "34px" }}
        anchorEl={badgeRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isOpenMenuSite}
        onClose={handleCloseMenuSite}
      >
        {getSite?.url && (
          <MenuItem
            component={Link}
            href={getSite.url}
            target="_blank"
            onClick={handleCloseMenuSite}
          >
            <StyledListItemIcon>
              <IconLink fontSize="small" />
            </StyledListItemIcon>
            <ListItemText>Open site</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          component={Link}
          href={linkToDashboard}
          onClick={handleCloseMenuSite}
        >
          <StyledListItemIcon>
            <DashboardIcon fontSize="small" />
          </StyledListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </MenuItem>

        <MenuItem
          component={Link}
          href={linkPostManagement}
          onClick={handleCloseMenuSite}
        >
          <StyledListItemIcon>
            <FIleTextIcon fontSize="small" />
          </StyledListItemIcon>
          <ListItemText>Posts</ListItemText>
        </MenuItem>

        {userIsAdmin && (
          <>
            <MenuItem
              component={Link}
              href={linkSwitchTheme}
              onClick={handleCloseMenuSite}
            >
              <StyledListItemIcon>
                <BrushIcon fontSize="small" />
              </StyledListItemIcon>
              <ListItemText>Theme</ListItemText>
            </MenuItem>

            <MenuItem
              component={Link}
              href={linkSettings}
              onClick={handleCloseMenuSite}
            >
              <StyledListItemIcon>
                <SettingsIcon fontSize="small" />
              </StyledListItemIcon>
              <ListItemText>Settings</ListItemText>
            </MenuItem>

            <MenuItem onClick={handeOpenConfirm}>
              <StyledListItemIconDelete>
                <TrashIcon fontSize="small" />
              </StyledListItemIconDelete>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};
