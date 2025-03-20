"use client";
import {
  Alert,
  Autocomplete,
  Avatar,
  Button,
  ListItem,
  TextField,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import {
  StyledAuthor,
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
  StyledAuthorWrap,
  StyledAuthorName,
  StyledDialogTitle,
  StyledAuthorGroup,
} from "@/components/ModalAuthorContributors/styled";
import { debounce } from "lodash";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";
import { fetchProfiles, searchProfiles } from "@/services/nostr/api";
import useResponsive from "@/hooks/useResponsive";
import { CrossIcon, TrashIcon } from "../Icons";

export const ModalAuthorContributors = ({
  isOpen,
  handleClose,
  pubkeysContributors,
  handleAuthor,
}: {
  isOpen: boolean;
  pubkeysContributors: string[];
  handleClose: () => void;
  handleAuthor: (pubkeys: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<
    { pubkey: string; name: string; img: string }[]
  >([]);
  const [isLoading, setLoading] = useState(false);
  const [contributors, setContributors] = useState<NDKEvent[]>([]);

  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  useEffect(() => {
    if (pubkeysContributors.length) {
      fetchProfiles(pubkeysContributors)
        .then((p) => {
          if (p.length) {
            setContributors(p);
          } else {
            setContributors([]);
          }
        })
        .catch(() => {
          setContributors([]);
        });
    } else {
      setContributors([]);
    }
  }, [pubkeysContributors]);

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
      handleAuthor([author.pubkey, ...pubkeysContributors]);
      setInputValue("");
    }
  };

  const handleDeleteContributor = (pubkeyContributor: string) => {
    const prepareData = pubkeysContributors.filter(
      (el) => el !== pubkeyContributor,
    );

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
      <StyledDialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Contributors
          <Button
            onClick={handleCancel}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <CrossIcon color="inherit" />
          </Button>
        </StyledTitle>
      </StyledDialogTitle>
      <StyledDialogContent>
        {contributors.length ? (
          <StyledAuthorGroup>
            {contributors.map((el, i) => {
              const dataContributor = JSON.parse(el.content);
              const npubContributor =
                nip19.npubEncode(el.pubkey).substring(0, 8) + "...";
              const nameContributor =
                dataContributor?.display_name ||
                dataContributor?.name ||
                npubContributor;
              const imgContributor = dataContributor?.picture || "";

              return (
                <StyledAuthorWrap key={i}>
                  <StyledAuthor>
                    <Avatar
                      alt={nameContributor}
                      src={imgContributor}
                      sx={{ width: 40, height: 40 }}
                    />
                    <StyledAuthorName>{nameContributor}</StyledAuthorName>
                  </StyledAuthor>

                  <Button
                    onClick={() => handleDeleteContributor(el.pubkey)}
                    variant="text"
                    color="error"
                    sx={{ minWidth: "auto" }}
                    disabled={contributors.length === 1}
                  >
                    <TrashIcon color="inherit" />
                  </Button>
                </StyledAuthorWrap>
              );
            })}
          </StyledAuthorGroup>
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
          size={sizeField}
          loadingText={"Searching..."}
          options={options.filter(
            (option) => !pubkeysContributors.includes(option.pubkey),
          )}
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
              label="Name"
              onChange={(event) => setInputValue(event.target.value)}
            />
          )}
        />
      </StyledDialogContent>
    </StyledDialog>
  );
};
