"use client";
import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { Box, Divider, List, ListItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import KeyboardArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardArrowLeftTwoTone";
import {
  StyledSideBarBottom,
  StyledSieBarButton,
  StyledSieBarContent,
  StyledSieBarDrawer,
  StyledSieBarElements,
} from "./styled";
import { ListSitesDropdown } from "@/components/ListSitesDropdown";
import { NavSettings } from "@/components/Layout/SideBarNav/components/NavSettings";
import { NAV_CONFIG } from "@/consts";

const NAV_WIDTH = 280;

export const SideBarNav = ({ openNav = true }) => {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const isDesktop = useResponsive("up", "lg");

  const handleGoTo = (path: string) => {
    router.push(path);
  };

  const isSettings = pathname === `/${params.id}/settings`;
  const isParamsID = Boolean(params.id);

  const renderContent = (
    <StyledSieBarContent>
      <StyledSieBarElements>
        {isSettings ? (
          <StyledSieBarButton
            onClick={() => router.push(`/${params.id}/dashboard`)}
            size="large"
            fullWidth
            variant="text"
            color="textColor"
            startIcon={<KeyboardArrowLeftTwoToneIcon />}
          >
            Back to dashboard
          </StyledSieBarButton>
        ) : (
          <ListSitesDropdown />
        )}
      </StyledSieBarElements>
      <Divider />
      {isParamsID && (
        <List disablePadding>
          {isSettings ? (
            <NavSettings />
          ) : (
            NAV_CONFIG.map(({ title, path: slug, icon }) => {
              const path = `/${params.id}/${slug}`;

              return (
                <ListItem key={title}>
                  <StyledSieBarButton
                    size="large"
                    fullWidth
                    variant={pathname === path ? "contained" : "text"}
                    color={
                      pathname === path ? "buttonSidebarActive" : "textColor"
                    }
                    href={path}
                    LinkComponent={Link}
                    startIcon={icon}
                  >
                    {title}
                  </StyledSieBarButton>
                </ListItem>
              );
            })
          )}
        </List>
      )}

      {!isSettings && (
        <StyledSideBarBottom>
          <IconButton aria-label="profile" size="large">
            <AccountCircleTwoToneIcon fontSize="inherit" />
          </IconButton>

          {isParamsID && (
            <IconButton
              onClick={() => handleGoTo(`/${params.id}/settings`)}
              aria-label="settings"
              size="large"
            >
              <SettingsTwoToneIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledSideBarBottom>
      )}
    </StyledSieBarContent>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <StyledSieBarDrawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
            },
          }}
        >
          {renderContent}
        </StyledSieBarDrawer>
      ) : (
        <StyledSieBarDrawer
          open={openNav}
          //   onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </StyledSieBarDrawer>
      )}
    </Box>
  );
};
