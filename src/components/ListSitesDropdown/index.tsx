"use client";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useListSites } from "@/hooks/useListSites";
import {
  StyledLoadingButton,
  StyledWarpperActions,
} from "@/components/ListSitesDropdown/styled";
import { IconButton } from "@mui/material";

export const ListSitesDropdown = () => {
  const { data, isLoading, isFetching } = useListSites();

  const router = useRouter();
  const params = useParams();
  const path = usePathname();

  const isHome = path === "/";

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelect = (id: string) => {
    setAnchorEl(null);
    router.push(`/${id}`);
  };

  const handleClickBackToHome = () => {
    router.push("/");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const siteInfo = (data ? data.filter((el) => el.id === params.id) : [])[0];
  const siteTitle = siteInfo?.title ? siteInfo.title : "Select a site";

  return (
    <StyledWarpperActions>
      {!isHome && (
        <IconButton onClick={handleClickBackToHome} aria-label="back to home">
          <HomeTwoToneIcon />
        </IconButton>
      )}

      <StyledLoadingButton
        loading={isLoading || isFetching}
        disabled={isLoading || isFetching}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreTwoToneIcon />}
        fullWidth
        variant="contained"
        color="buttonSidebarBackground"
        sx={{ textTransform: "none" }}
      >
        {siteTitle}
      </StyledLoadingButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {data?.length ? (
          data.map((el, i) => {
            return (
              <MenuItem key={i} onClick={() => handleSelect(el.id)}>
                {el.title}
              </MenuItem>
            );
          })
        ) : (
          <MenuItem>List sites empty</MenuItem>
        )}
      </Menu>
    </StyledWarpperActions>
  );
};
