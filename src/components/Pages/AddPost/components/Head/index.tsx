"use client";
import { ChevronLeftIcon, CrossIcon, InfoIcon } from "@/components/Icons";
import { Button, Collapse, IconButton } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  StyledAlert,
  StyledAlertTitle,
  StyledButtonInfo,
  StyledTitle,
} from "./styled";

export const Head = ({ siteId }: { siteId: string }) => {
  const flagAlert = "isOpenAlertInfo";

  const [isOpenAlertInfo, setOpenAlertInfo] = useState(false);

  const backToDashboardLink = `/admin/${siteId}/post-management`;

  const handleOpenAlertInfo = () => {
    setOpenAlertInfo(true);

    localStorage.setItem(flagAlert, "true");
  };

  const handleCloseAlertInfo = () => {
    setOpenAlertInfo(false);

    localStorage.setItem(flagAlert, "false");
  };

  useEffect(() => {
    const getOpenAlertInfo = localStorage.getItem(flagAlert);

    if (getOpenAlertInfo) {
      setOpenAlertInfo(JSON.parse(getOpenAlertInfo));
    } else {
      setOpenAlertInfo(true);
    }
  }, []);

  return (
    <>
      <StyledTitle>
        <Button
          LinkComponent={Link}
          href={backToDashboardLink}
          color="primary"
          variant="text"
          sx={{ minWidth: "auto" }}
        >
          <ChevronLeftIcon />
        </Button>
        Posts ideas
        <StyledButtonInfo
          onClick={handleOpenAlertInfo}
          color="info"
          aria-label="info"
          size="small"
        >
          <InfoIcon fontSize="inherit" />
        </StyledButtonInfo>
      </StyledTitle>

      <Collapse in={isOpenAlertInfo}>
        <StyledAlert
          severity="info"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleCloseAlertInfo}
            >
              <CrossIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <StyledAlertTitle>Content management section</StyledAlertTitle>
          In this section you will find any posts, and manage your content
        </StyledAlert>
      </Collapse>
    </>
  );
};
