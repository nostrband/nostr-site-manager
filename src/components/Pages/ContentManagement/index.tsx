"use client";

import React, { memo, useCallback, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  useMediaQuery,
  DialogContent,
  IconButton,
  CircularProgress,
} from "@mui/material";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { TitleAdmin } from "@/components/TitleAdmin";
import {
  AvatarContributor,
  GroupContributors,
  TitleSection,
  TitleSiteName,
} from "./styled";
import { SearchPost, submitPost } from "@/services/nostr/content";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { Filter } from "./Filter";
import { ContentCard } from "./ContentCard";
import { useSnackbar } from "notistack";
import { SEARCH_RELAYS } from "@/services/nostr/nostr";

export const ContentManagement = memo(
  ({ siteData }: { siteData: ReturnSettingsSiteDataType }) => {
    console.log({ siteData, ContentManagement: "ContentManagement" });
    const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");
    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState<SearchPost[]>([]);
    const { enqueueSnackbar } = useSnackbar();

    const handleOpenFilterDialog = () => {
      setFilterDialogOpen(true);
    };

    const handleCloseFilterDialog = () => {
      setFilterDialogOpen(false);
    };

    const handleSetCards = useCallback(
      (cards: SearchPost[]) => {
        setCards(cards);
      },
      [setCards],
    );

    const handleSetLoading = useCallback(
      (state: boolean) => {
        setIsLoading(state);
      },
      [setIsLoading],
    );

    const handleSubmit = useCallback(async (card: SearchPost) => {
      try {
        await submitPost(siteData.id, {
          id: card.id,
          author: card.event.pubkey,
          kind: card.event.kind!,
          url: "",
        });
        card.status = 'manual';
      } catch (e: any) {
        console.log("error", e);
        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      }
    }, [siteData])

    return (
      <>
        <TitleAdmin>Content management</TitleAdmin>

        <GroupContributors>
          <AvatarContributor src={siteData?.image} variant="rounded">
            <InsertPhotoOutlinedIcon />
          </AvatarContributor>
          <TitleSiteName variant="h5">{siteData?.name}</TitleSiteName>
        </GroupContributors>

        <TitleSection variant="h5">Filter</TitleSection>

        {!isMobile ? (
          <Filter
            siteData={siteData}
            setCards={handleSetCards}
            isLoading={isLoading}
            handleLoading={handleSetLoading}
          />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleOpenFilterDialog}
              sx={{ marginBottom: "20px" }}
            >
              Open Filter
            </Button>
            <Dialog
              open={isFilterDialogOpen}
              onClose={handleCloseFilterDialog}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>
                Filter
                <IconButton
                  aria-label="close"
                  onClick={handleCloseFilterDialog}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Filter
                  siteData={siteData}
                  setCards={handleSetCards}
                  isLoading={isLoading}
                  handleLoading={handleSetLoading}
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        <TitleSection variant="h5">Results</TitleSection>

        {isLoading ? (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: "200px" }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={2}>
            {cards.map((card, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <ContentCard card={card} submit={handleSubmit} />
                </Grid>
              );
            })}
          </Grid>
        )}
      </>
    );
  },
);

ContentManagement.displayName = "ContentManagement";
