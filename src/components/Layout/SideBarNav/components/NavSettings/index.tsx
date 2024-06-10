"use client";
import { useParams } from "next/navigation";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { ListItem, Skeleton, ListSubheader } from "@mui/material";
import { StyledSieBarButton } from "@/components/Layout/SideBarNav/styled";
import Link from "next/link";
import { SETTINGS_CONFIG } from "@/consts";
import { Fragment, useEffect, useState } from "react";

export const NavSettings = () => {
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isLoading, isFetching } = useSettingsSite(siteId);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(window.location.hash);
  }, []);

  if (isLoading || isFetching) {
    return (
      <>
        <ListSubheader sx={{ mt: 1 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={20}
            sx={{ borderRadius: 1 }}
          />
        </ListSubheader>
        {Array.from({ length: 9 }).map((_, i) => (
          <ListItem key={i}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </ListItem>
        ))}
      </>
    );
  }

  return SETTINGS_CONFIG.map(({ title, sublist }, i) => {
    return (
      <Fragment key={i}>
        <ListSubheader>{title}</ListSubheader>

        {sublist.map(({ title, path, icon }, j) => {
          const hashPath = `#${path}`;

          return (
            <ListItem key={j}>
              <StyledSieBarButton
                size="large"
                fullWidth
                variant={hash === hashPath ? "contained" : "text"}
                color={hash === hashPath ? "buttonSidebarActive" : "textColor"}
                href={hashPath}
                LinkComponent={Link}
                startIcon={icon}
                onClick={() => {
                  setHash(hashPath);
                }}
              >
                {title}
              </StyledSieBarButton>
            </ListItem>
          );
        })}
      </Fragment>
    );
  });
};
