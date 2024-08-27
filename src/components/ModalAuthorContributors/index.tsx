"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  DialogTitle,
  Fab,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  StyledAuthor,
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
  StyledActionContributor,
} from "@/components/ModalAuthorContributors/styled";
import { debounce } from "lodash";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { searchProfiles } from "@/services/nostr/api";
import { ContributorType } from "@/services/sites.service";
import { ContributorContent } from "./components/ContributorContent";

export const ModalAuthorContributors = ({
  isOpen,
  handleClose,
  dataContributors,
  pubkeysContributors,
  contributorsEvent,
  handleAuthor,
  handleChangeSettingsContributors,
  defaultKinds,
  defaultHashtags,
}: {
  isOpen: boolean;
  dataContributors: ContributorType[];
  pubkeysContributors: string[];
  handleClose: () => void;
  contributorsEvent: NDKEvent[];
  handleAuthor: (pubkeys: string[]) => void;
  handleChangeSettingsContributors: (contributors: ContributorType[]) => void;
  defaultKinds: number[];
  defaultHashtags: string[];
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<
    { pubkey: string; name: string; img: string }[]
  >([]);
  const [isLoading, setLoading] = useState(false);

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setOptions([]);
      const profiles = await searchProfiles(query);
      console.log("profiles", profiles);
      const options = profiles
        .map((e) => {
          try {
            const meta = JSON.parse(e.content);
            return {
              pubkey: e.pubkey,
              name: meta?.display_name || meta?.name || e.pubkey,
              img: meta?.picture || "",
            };
          } catch {
            return undefined;
          }
        })
        .filter((p) => !!p);
      console.log("options", options);
      setLoading(false);
      // @ts-ignore
      setOptions(options);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const handleChangeAuthor = (
    _: SyntheticEvent<Element, Event>,
    author: { pubkey: string; name: string; img: string } | string | null,
  ) => {
    if (author !== null && typeof author !== "string") {
      handleAuthor([author.pubkey, ...pubkeysContributors]);
      handleChangeSettingsContributors([
        { pubkey: author.pubkey, hashtags: [], kinds: [] },
        ...dataContributors,
      ]);
      setInputValue("");
    }
  };

  const handleDeleteContributor = (pubkeyContributor: string) => {
    const prepareData = pubkeysContributors.filter(
      (el) => el !== pubkeyContributor,
    );

    const prepareSettingsData = dataContributors.filter(
      (el) => el.pubkey !== pubkeyContributor,
    );

    handleChangeSettingsContributors([...prepareSettingsData]);
    handleAuthor([...prepareData]);
  };

  const handleCancel = () => {
    handleClose();
    setInputValue("");
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), []);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchData(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, debouncedFetchData, setOptions]);

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Contributors
          <Fab
            onClick={handleCancel}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <StyledDialogContent>
        {contributorsEvent.length ? (
          <Box sx={{ marginBottom: "15px" }}>
            {contributorsEvent.map((el) => {
              const dataContributor = JSON.parse(el.content);
              const npubContributor =
                nip19.npubEncode(el.pubkey).substring(0, 8) + "...";
              const nameContributor =
                dataContributor?.display_name ||
                dataContributor?.name ||
                npubContributor;
              const imgContributor = dataContributor?.picture || "";

              const contentContributor = dataContributors.find(
                (c) => c.pubkey === el.pubkey,
              ) || { pubkey: el.pubkey, hashtags: [], kinds: [] };

              const prepareContent = {
                ...contentContributor,
                hashtags: contentContributor.hashtags.length
                  ? contentContributor.hashtags
                  : defaultHashtags,
                kinds: contentContributor.kinds.length
                  ? contentContributor.kinds
                  : defaultKinds,
              };

              return (
                <Accordion elevation={0} key={el.pubkey}>
                  <AccordionSummary
                    sx={{ paddingLeft: 0, paddingRight: 0 }}
                    expandIcon={<ExpandMoreOutlinedIcon />}
                    aria-controls={el.pubkey}
                    id={el.pubkey}
                  >
                    <StyledAuthor key={el.pubkey}>
                      <Avatar
                        alt={nameContributor}
                        src={imgContributor}
                        sx={{ width: 43, height: 43 }}
                      />
                      <Typography variant="body2" component="div">
                        <b>{nameContributor}</b>
                      </Typography>
                    </StyledAuthor>
                  </AccordionSummary>
                  <AccordionDetails sx={{ paddingLeft: 0, paddingRight: 0 }}>
                    <StyledActionContributor>
                      <ContributorContent
                        dataContributors={dataContributors}
                        pubkey={el.pubkey}
                        content={prepareContent}
                        handleChangeContentContributor={
                          handleChangeSettingsContributors
                        }
                      />
                      <Button
                        onClick={() => handleDeleteContributor(el.pubkey)}
                        variant="outlined"
                        color="error"
                        disabled={contributorsEvent.length === 1}
                      >
                        Delete
                      </Button>
                    </StyledActionContributor>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ) : (
          <Alert
            sx={{ marginBottom: "15px" }}
            icon={<Inventory2OutlinedIcon fontSize="inherit" />}
            severity="info"
          >
            Add another author for contributers
          </Alert>
        )}

        <Autocomplete
          freeSolo
          disablePortal
          loading={isLoading}
          loadingText={"Searching..."}
          options={options}
          onChange={handleChangeAuthor}
          inputValue={inputValue}
          filterOptions={(options) => options}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.name
          }
          renderOption={(props, option) =>
            typeof option === "string" ? (
              option
            ) : (
              <ListItem {...props} key={option.pubkey}>
                <ListItemAvatar>
                  <Avatar src={option.img} alt={option.name} />
                </ListItemAvatar>
                <ListItemText primary={option.name} />
              </ListItem>
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Add another contributors"
              onChange={(event) => setInputValue(event.target.value)}
            />
          )}
        />
      </StyledDialogContent>
    </StyledDialog>
  );
};
