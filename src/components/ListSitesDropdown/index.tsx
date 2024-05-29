"use client";
import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import LoadingButton from "@mui/lab/LoadingButton";
import { useParams, useRouter } from "next/navigation";
import { useListSites } from "@/hooks/useListSites";

export const ListSitesDropdown = () => {
  const { data, isLoading, isFetching } = useListSites();

  const router = useRouter();
  const params = useParams();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelect = (id: string) => {
    setAnchorEl(null);
    router.push(`/${id}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const siteInfo = (data ? data.filter((el) => el.id === params.id) : [])[0];
  const siteTitle = siteInfo?.title ? siteInfo.title : "Select a site";

  return (
    <div>
      <LoadingButton
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
      >
        {siteTitle}
      </LoadingButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {data?.length &&
          data.map((el, i) => {
            return (
              <MenuItem key={i} onClick={() => handleSelect(el.id)}>
                {el.title}
              </MenuItem>
            );
          })}
      </Menu>
    </div>
  );
};
