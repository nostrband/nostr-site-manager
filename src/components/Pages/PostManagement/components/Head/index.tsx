"use client";
import {
  ChevronLeftIcon,
  CrossIcon,
  InfoIcon,
  PlusIcon,
} from "@/components/Icons";
import { Button, Collapse, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import {
  StyledAddPostButton,
  StyledAlert,
  StyledAlertTitle,
  StyledButtonInfo,
  StyledFilterActions,
} from "./styled";
import { useBack } from "@/hooks/useBackPage";
import Link from "next/link";
import useResponsive from "@/hooks/useResponsive";
import { StyledTitlePage } from "@/components/shared/styled";

export const Head = ({ linkToAddPost }: { linkToAddPost: string }) => {
  const flagAlert = "isOpenAlertInfoPost";
  const isDesktop = useResponsive("up", "sm");
  const { back } = useBack();

  const [isOpenAlertInfo, setOpenAlertInfo] = useState(false);

  const handleOpenAlertInfo = () => {
    setOpenAlertInfo(true);

    localStorage.setItem(flagAlert, "true");
  };

  const handleCloseAlertInfo = () => {
    setOpenAlertInfo(false);

    localStorage.setItem(flagAlert, "false");
  };

  const handleBack = () => {
    back("dashboard");
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
      <StyledTitlePage>
        <Button
          color="secondary"
          onClick={handleBack}
          variant="text"
          sx={{ minWidth: "auto" }}
        >
          <ChevronLeftIcon />
        </Button>
        Posts
        <StyledFilterActions>
          {isDesktop && (
            <StyledAddPostButton
              LinkComponent={Link}
              href={linkToAddPost}
              size="large"
              fullWidth
              variant="contained"
              endIcon={<PlusIcon fontSize="inherit" />}
            >
              Add post
            </StyledAddPostButton>
          )}
          <StyledButtonInfo
            onClick={handleOpenAlertInfo}
            color="info"
            aria-label="info"
            size="small"
          >
            <InfoIcon fontSize="inherit" />
          </StyledButtonInfo>
        </StyledFilterActions>
      </StyledTitlePage>

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
          <StyledAlertTitle>Post management</StyledAlertTitle>
          View posts already published on your site.
        </StyledAlert>
      </Collapse>
    </>
  );
};
