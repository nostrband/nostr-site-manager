import React, { SyntheticEvent, useEffect, useMemo, useState } from "react";
import _, { debounce } from "lodash";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  Autocomplete,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { DropResult } from "@hello-pangea/dnd";
import CloseIcon from "@mui/icons-material/Close";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { HASH_CONFIG } from "@/consts";
import { IPinnedNote } from "./types";
import { PinnedNote } from "./components/PinnedNote";
import { StyledDialog, StyledDialogContent, StyledTitle } from "./styled";
import { reorder } from "./helpers";
import { ListPinnedNote } from "./components/ListPinnedNote";
import { fetchPins, searchPosts } from "@/services/nostr/api";
import { Post } from "libnostrsite";

function convertPosts(posts: Post[]) {
  const pins: IPinnedNote[] = [];
  for (const post of posts) {
    pins.push({
      id: post.id,
      title: post.title || "",
      picture: post.images?.[0] || "",
      summary: post.excerpt || "",
      datetime: post.published_at || "",
    });
  }
  return pins;
}

export const PinnedNotes = ({ siteId }: { siteId: string }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dataPinnedNotes, setDataPinnedNotes] = useState<IPinnedNote[]>([]);
  const [originalPinnedNotes, setOriginalPinnedNotes] = useState<IPinnedNote[]>(
    []
  );

  const [options, setOptions] = useState<IPinnedNote[]>([]);

  const handleRemove = (id: string) => {
    const updatedNotes = dataPinnedNotes.filter((note) => note.id !== id);
    setDataPinnedNotes(updatedNotes);
  };

  const handleAction = () => {
    if (!_.isEqual(dataPinnedNotes, originalPinnedNotes)) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsEdit(false);
        setOriginalPinnedNotes(dataPinnedNotes);
      }, 2000);
    } else {
      if (isEdit) {
        setIsEdit(false);
      } else {
        setIsEdit(true);
        setOpen(true);
      }
    }
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;

    const newItems = reorder(dataPinnedNotes, source.index, destination.index);

    setDataPinnedNotes(newItems);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeAuthor = (
    _: SyntheticEvent<Element, Event>,
    pinnedNote: IPinnedNote | string | null
  ) => {
    if (pinnedNote !== null && typeof pinnedNote !== "string") {
      const isAlreadyPinned = dataPinnedNotes.some(
        (note) => note.id === pinnedNote.id
      );

      if (!isAlreadyPinned) {
        setDataPinnedNotes([...dataPinnedNotes, pinnedNote]);
      }
      setInputValue("");
    }
  };

  console.log("siteId", siteId);
  useEffect(() => {
    setLoading(true);
    fetchPins(siteId)
      .then((posts) => {
        const pins = convertPosts(posts);
        setDataPinnedNotes(pins);
        setOriginalPinnedNotes(pins);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching pins:", e);
        setLoading(false);
      });
  }, [siteId]);

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setOptions([]);

      console.log("query", query, siteId);
      const posts = await searchPosts(siteId, query);
      // console.log("events", posts);
      const pins = convertPosts(posts);
      console.log("found pins", pins);

      setLoading(false);
      setOptions(pins);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), [siteId]);

  useEffect(() => {
    if (inputValue) {
      debouncedFetchData(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue, debouncedFetchData, setOptions, siteId]);

  return (
    <StyledSettingCol id={HASH_CONFIG.PINNED_NOTES}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Pinned notes</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Pinned notes for content, you can change order notes
        </Typography>

        {isLoading && dataPinnedNotes.length === 0 ? (
          <CircularProgress />
        ) : (
          <List sx={{ p: 0 }}>
            {dataPinnedNotes.map((el) => (
              <PinnedNote
                key={el.id}
                id={el.id}
                title={el.title}
                summary={el.summary}
                picture={el.picture}
              />
            ))}
          </List>
        )}

        <StyledDialog onClose={handleClose} open={isOpen}>
          <DialogTitle>
            <StyledTitle variant="body1">
              Manage pinned posts
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
          <StyledDialogContent>
            <Typography sx={{ mt: 1, mb: 1 }} variant="body2">
              Pin posts to always show them at the top and to mark them as{" "}
              <em>featured</em>, depending on your theme.
            </Typography>
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
                typeof option === "string" ? option : option.title
              }
              renderOption={(props, option) => {
                const isAlreadyPinned = dataPinnedNotes.some(
                  (note) => note.id === option.id
                );

                return typeof option === "string" ? (
                  option
                ) : (
                  <ListItem
                    {...props}
                    key={option.id}
                    alignItems="flex-start"
                    secondaryAction={
                      isAlreadyPinned ? undefined : (
                        <IconButton edge="end" aria-label="add" color="info">
                          <PushPinOutlinedIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt={option.title} src={option.picture} />
                    </ListItemAvatar>
                    <ListItemText primary={`${option.id} - ${option.title}`} />
                  </ListItem>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search posts"
                  onChange={(event) => setInputValue(event.target.value)}
                />
              )}
            />

            <ListPinnedNote
              handleRemove={handleRemove}
              items={dataPinnedNotes}
              onDragEnd={onDragEnd}
            />
            {Boolean(dataPinnedNotes.length) && (
              <Typography sx={{ mt: 1 }} variant="body2">
                Drag & drop to change the order
              </Typography>
            )}
          </StyledDialogContent>
        </StyledDialog>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
