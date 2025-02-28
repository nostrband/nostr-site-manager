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
import { CircularProgress, ListItemText } from "@mui/material";
import {
  BrokenIcon,
  BrushIcon,
  DashboardIcon,
  FIleTextIcon,
  KeyIcon,
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
import { useSnackbar } from "notistack";
import {
  isNeedMigrateKey,
  migrateToConnectedKey,
} from "@/services/nostr/migrate";

export const ActionsUser = () => {
  const { isAuth } = useContext(AuthContext);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isOpenMenuSite, setOpenSite] = useState(false);
  const [isLoadingConnectKeys, setLoadingConnectKeys] = useState(false);
  const router = useRouter();
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);
  const [isOpenConfirm, setOpenConfirm] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const badgeRef = useRef<HTMLElement>(null);

  const { siteId } = useGetSiteId();
  const { data } = useListSites();
  const getSite = data?.find((el) => el.id === siteId);

  const userIsAdmin =
    userPubkey && getSite && getSite.adminPubkey === userPubkey;

  const linkToDashboard = `/admin/${siteId}/dashboard`;
  const linkSwitchTheme = `/design?siteId=${siteId}&themeId=${getSite?.themeId}`;
  const linkSettings = `/admin/${siteId}/settings`;
  const linkPostManagement = `/admin/${siteId}/posts`;

  const { isLoaded } = useImageLoader(getSite ? getSite.icon : "");

  const handleConnectKeys = async () => {
    setLoadingConnectKeys(true);

    try {
      const newSiteId = await migrateToConnectedKey(siteId);
      enqueueSnackbar("Keys connected!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      setTimeout(() => {
        setLoadingConnectKeys(false);

        router.push(`/admin/${newSiteId}`);
      }, 500);
    } catch (e: any) {
      setLoadingConnectKeys(false);

      console.log("error", e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
    }
  };

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

          <StyledBadgeTitle variant="body2">{getSite?.title}</StyledBadgeTitle>

          <IconButton onClick={handleOpenMenuSite} size="small">
            <MoreIcon fontSize="inherit" />
          </IconButton>

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

                {isNeedMigrateKey(siteId) && (
                  <MenuItem
                    onClick={handleConnectKeys}
                    disabled={isLoadingConnectKeys}
                  >
                    <StyledListItemIcon>
                      {isLoadingConnectKeys ? (
                        <CircularProgress size={20} />
                      ) : (
                        <KeyIcon fontSize="small" />
                      )}
                    </StyledListItemIcon>
                    <ListItemText>Connect keys</ListItemText>
                  </MenuItem>
                )}

                <MenuItem onClick={handeOpenConfirm}>
                  <StyledListItemIconDelete>
                    <TrashIcon fontSize="small" />
                  </StyledListItemIconDelete>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </>
            )}
          </Menu>
        </StyledBadgeWrap>
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
    </>
  );
};
