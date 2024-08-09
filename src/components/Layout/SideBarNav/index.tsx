import Link from "next/link";
import { usePathname, useRouter, useParams } from "next/navigation";
import useResponsive from "@/hooks/useResponsive";
import { Box, Divider, Drawer, List, ListItem } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import KeyboardArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardArrowLeftTwoTone";
import {
  // StyledSideBarBottom,
  StyledSieBarButton,
  StyledSieBarContent,
  StyledSieBarElements,
} from "./styled";
import { ListSitesDropdown } from "@/components/ListSitesDropdown";
import { NavSettings } from "@/components/Layout/SideBarNav/components/NavSettings";
import { NAV_CONFIG, SIDEBAR_WIDTH } from "@/consts";
import { useFirstPathElement } from "@/hooks/useFirstPathElement";
import { useEffect, useState } from "react";
import { useListSites } from "@/hooks/useListSites";

interface ISideBarNav {
  isOpen: boolean;
  handleClose: () => void;
}

export const SideBarNav = ({ isOpen, handleClose }: ISideBarNav) => {
  const pathname = usePathname();
  const pathAdmin = useFirstPathElement();
  const params = useParams();
  const router = useRouter();
  const isDesktop = useResponsive("up", "lg");
  const [isLogin, setLogin] = useState(false);

  const isSettings = pathname === `${pathAdmin}/${params.id}/settings`;
  const isParamsID = Boolean(params.id);

  const { data } = useListSites();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getSite = data?.find((el) => el.id === siteId);

  const switchTheme = `/design?siteId=${siteId}&themeId=${getSite?.themeId}`;

  useEffect(() => {
    if (localStorage.getItem("__nostrlogin_nip46")) {
      setLogin(true);
    }
  }, []);

  const renderContent = (
    <StyledSieBarContent>
      <StyledSieBarElements>
        {isSettings ? (
          <StyledSieBarButton
            onClick={() => {
              router.push(`${pathAdmin}/${params.id}/dashboard`);
              handleClose();
            }}
            size="large"
            fullWidth
            variant="text"
            color="textColor"
            startIcon={<KeyboardArrowLeftTwoToneIcon />}
          >
            Back to dashboard
          </StyledSieBarButton>
        ) : (
          <ListSitesDropdown handleCloseSideBar={handleClose} />
        )}
      </StyledSieBarElements>
      <Divider />
      {isParamsID && (
        <List disablePadding>
          {isSettings ? (
            <NavSettings handleCloseSideBar={handleClose} />
          ) : (
            NAV_CONFIG.map(({ title, path: slug, icon }) => {
              const path = `${pathAdmin}/${params.id}/${slug}`;

              return (
                <ListItem key={title}>
                  <StyledSieBarButton
                    onClick={handleClose}
                    size="large"
                    fullWidth
                    variant={pathname === path ? "contained" : "text"}
                    color={
                      pathname === path ? "buttonSidebarActive" : "textColor"
                    }
                    href={slug === "switchTheme" ? switchTheme : path}
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

      {/* {!isSettings && (
        <>
          {isLogin && (
            <StyledSideBarBottom>
              <IconButton aria-label="profile" size="large">
                <AccountCircleTwoToneIcon fontSize="inherit" />
              </IconButton>
            </StyledSideBarBottom>
          )}
        </>
      )} */}
    </StyledSieBarContent>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: SIDEBAR_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          anchor="right"
          variant="permanent"
          PaperProps={{
            sx: {
              width: SIDEBAR_WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={isOpen}
          anchor="right"
          onClose={handleClose}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: SIDEBAR_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
};
