"use client";
import { Box, Button, Card, CardMedia, DialogTitle, Fab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
} from "@/components/ModalAuthor/styled";
import { TYPES_THEMES_TAG } from "@/consts";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { StyledCardHeader } from "@/components/PreviewSite/styled";
import { StyledCardNoImage } from "@/components/PreviewSite/styled";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import { StyledIconButton } from "@/components/PreviewNavigation/styled";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useRouter } from "next/navigation";
import { StyledAvatarSite } from "@/components/shared/styled";

export const ModalSites = ({
  isOpen,
  themeId,
  handleClose,
  tag,
  sites,
}: {
  isOpen: boolean;
  themeId: string;
  tag: TYPES_THEMES_TAG | null;
  handleClose: () => void;
  sites: ReturnSettingsSiteDataType[];
}) => {
  const router = useRouter();
  const [activeSite, setActiveSite] = useState(0);
  const getSite = sites ? sites[activeSite] : null;

  const onNextSite = () => {
    if (sites.length === activeSite + 1) {
      setActiveSite(0);

      return;
    }

    setActiveSite((prev) => prev + 1);
  };

  const onPrevSite = () => {
    if (0 === activeSite) {
      setActiveSite(sites.length - 1);

      return;
    }

    setActiveSite((prev) => prev - 1);
  };

  const handleNavigatePreview = () => {
    router.push(`/preview?themeId=${themeId}${tag ? `&tag=${tag}` : ""}`);
  };
  const handleNavigateEdit = () => {
    router.push(`/preview?themeId=${themeId}&siteId=${getSite?.id}`);
  };

  if (!getSite) {
    return null;
  }
  console.log("getSite", getSite);

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          You already have {sites.length} website{sites.length > 1 ? "s" : ""}
          <Fab
            onClick={handleClose}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <StyledDialogContent sx={{ p: 0 }}>
        <Card
          elevation={0}
          sx={{ borderTop: "1px solid #ececec", borderRadius: 0 }}
        >
          <StyledCardHeader
            avatar={
              <StyledAvatarSite variant="square" src={getSite?.logo}>
                {getSite?.name}
              </StyledAvatarSite>
            }
            title={<b>{getSite?.title || getSite?.name}</b>}
            subheader={<Box>{getSite?.url}</Box>}
          />
          {Boolean(getSite?.image) ? (
            <CardMedia
              component="img"
              height="250"
              image={getSite?.image}
              alt={getSite?.name}
            />
          ) : (
            <StyledCardNoImage>
              <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
            </StyledCardNoImage>
          )}
        </Card>
      </StyledDialogContent>

      <Box
        sx={{ display: "flex", padding: 2, justifyContent: "space-between" }}
      >
        <StyledIconButton color="primary" size="small" onClick={onPrevSite}>
          <ArrowBackIcon />
        </StyledIconButton>

        <StyledIconButton onClick={onNextSite} color="primary" size="small">
          <ArrowForwardIcon />
        </StyledIconButton>
      </Box>

      <Box
        sx={{ display: "flex", padding: 2, gap: "10px", flexWrap: "nowrap" }}
      >
        <Button
          onClick={handleNavigateEdit}
          color="primary"
          variant="contained"
          size="small"
          fullWidth
        >
          Edit site
        </Button>
        <Button
          onClick={handleNavigatePreview}
          color="decorate"
          variant="contained"
          size="small"
          fullWidth
        >
          Create new site
        </Button>
      </Box>
    </StyledDialog>
  );
};
