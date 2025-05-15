"use client";
import { Button, Radio, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { CrossCircleIcon, CrossIcon } from "@/components/Icons";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledEmptyWrap,
  StyledList,
  StyledListItem,
  StyledText,
  StyledTitle,
} from "./styled";
import { useListSites } from "@/hooks/useListSites";
import { SiteBaseInfoPreview } from "@/components/shared/SiteBaseInfoPreview";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/services/nostr/nostr";

export const ModalSites = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
    const { isAuth } = useContext(AuthContext);
  const { data, isLoading, isFetching } = useListSites();
  const router = useRouter();
  const [selectSite, setSelectSite] = useState("");

  const handleChoice = (id: string) => {
    setSelectSite(id);
  };

  const isEmpty = !isAuth || data?.length === 0;

  const handleNavigateToSubscription = () => {
    router.push(`/admin/subscription?siteId=${selectSite}&type=site&plan=pro`);
  };

  const handleNavigateToCreateSite = () => {
    router.push("/onboarding");
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="h5">
          {!isEmpty && "Your sites"}
          <Button
            onClick={handleClose}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto", marginLeft: "auto" }}
          >
            <CrossIcon color="inherit" />
          </Button>
        </StyledTitle>
      </StyledDialogTitle>
      <StyledDialogContent>
        {isLoading && isFetching ? (
          <SpinerWrap>
            <SpinerCircularProgress />
          </SpinerWrap>
        ) : (
          <>
            {isEmpty ? (
              <StyledEmptyWrap>
                <CrossCircleIcon color="warning" fontSize="large" />
                <Typography variant="h5">
                  You don&lsquo;t have any websites
                </Typography>
                <Typography variant="body4">
                  Create a website and then you can purchase a subscription for
                  it
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleNavigateToCreateSite}
                >
                  Create a website
                </Button>
              </StyledEmptyWrap>
            ) : (
              <>
                <StyledText component="div" variant="body4">
                  Select a site and buy a subscription
                </StyledText>
                <StyledList>
                  {data?.map((el, i) => {
                    const siteInfo = {
                      logo: el.logo,
                      name: el.name,
                      title: el.title,
                      url: el.url,
                    };

                    const isChecked = selectSite === el.id;

                    return (
                      <StyledListItem
                        key={i}
                        onClick={() => handleChoice(el.id)}
                      >
                        <Radio size="small" checked={isChecked} />
                        <SiteBaseInfoPreview siteInfo={siteInfo} />
                      </StyledListItem>
                    );
                  })}
                </StyledList>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={!selectSite}
                  onClick={handleNavigateToSubscription}
                >
                  Continue
                </Button>
              </>
            )}
          </>
        )}
      </StyledDialogContent>
    </StyledDialog>
  );
};
