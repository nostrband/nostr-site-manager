"use client";
import {
  Autocomplete,
  Avatar,
  DialogTitle,
  Fab,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  StyledAuthor,
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
} from "@/components/ModalAuthor/styled";
import { debounce } from "lodash";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { fetchProfiles, searchProfiles } from "@/services/nostr/api";

export const ModalAuthor = ({
  isOpen,
  pubkey,
  handleClose,
}: {
  isOpen: boolean;
  pubkey: string;
  handleClose: (pubkey: string) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<
    { pubkey: string; name: string; img: string }[]
  >([]);
  const [isLoading, setLoading] = useState(false);
  const [author, setAuthor] = useState<NDKEvent | undefined>(undefined);

  useEffect(() => {
    fetchProfiles([pubkey])
      .then((p) => (p.length ? setAuthor(p[0]) : []))
      .catch(() => setAuthor(undefined));
  }, [pubkey]);

  let meta = undefined;
  if (author) {
    try {
      meta = JSON.parse(author.content);
    } catch (e) {
      console.error(e);
    }
  }

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
      handleClose(author.pubkey);
    }
  };

  const handleCancel = () => {
    handleClose(pubkey);
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), []);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchData(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, debouncedFetchData, setOptions]);

  const npub = nip19.npubEncode(pubkey).substring(0, 8) + "...";
  const name = meta?.display_name || meta?.name || npub;
  const img = meta?.picture || "";

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Author
          <Fab onClick={handleCancel} size="small" aria-label="close">
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <StyledDialogContent>
        <StyledAuthor>
          <Avatar alt={name} src={img} sx={{ width: 43, height: 43 }} />
          <Typography variant="body2" component="div">
            <b>{name}</b>
          </Typography>
        </StyledAuthor>

        <Autocomplete
          freeSolo
          disablePortal
          loading={isLoading}
          loadingText={"Searching..."}
          options={options}
          onChange={handleChangeAuthor}
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
              placeholder="Choose another author"
              onChange={(event) => setInputValue(event.target.value)}
            />
          )}
        />
      </StyledDialogContent>
    </StyledDialog>
  );
};
