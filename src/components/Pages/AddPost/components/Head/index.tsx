"use client";
import { ChevronLeftIcon, CrossIcon, InfoIcon } from "@/components/Icons";
import { Button, Collapse, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StyledAlert,
  StyledAlertTitle,
  StyledButtonInfo,
  StyledTitle,
} from "./styled";
import { useBack } from "@/hooks/useBackPage";

export const Head = ({ isSearchResult }: { isSearchResult: boolean }) => {
  const flagAlert = "isOpenAlertInfo";
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
    back();
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
          onClick={handleBack}
          color="primary"
          variant="text"
          sx={{ minWidth: "auto" }}
        >
          <ChevronLeftIcon />
        </Button>
        {isSearchResult ? " Search results" : "Posts ideas"}
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
          <StyledAlertTitle>Adding posts</StyledAlertTitle>
          Search for new posts on Nostr and add them to your site.
        </StyledAlert>
      </Collapse>
    </>
  );
};
