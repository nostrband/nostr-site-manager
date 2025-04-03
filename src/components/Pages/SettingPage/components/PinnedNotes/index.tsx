"use client";
import React, {
  memo,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import _, { debounce } from "lodash";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import { DropResult } from "@hello-pangea/dnd";
import { SaveButton } from "../SaveButton";
import { SETTINGS_CONFIG } from "@/consts";
import { IPinnedNote } from "./types";
import { PinnedNote } from "./components/PinnedNote";
import {
  StyledDescription,
  StyledDescriptionBottom,
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledList,
  StyledTitle,
} from "./styled";
import { reorder } from "./helpers";
import { ListPinnedNote } from "./components/ListPinnedNote";
import { fetchPins, savePins } from "@/services/nostr/api";
import { Post } from "libnostrsite";
import { StyledItemWrapDiv } from "./components/PinnedNote/styled";
import { userIsDelegated } from "@/services/nostr/nostr";
import { enqueueSnackbar } from "notistack";
import { PinnedNoteContent } from "./components/PinnedNoteContent";
import { CrossIcon, PinFillIcon, PinIcon } from "@/components/Icons";
import useResponsive from "@/hooks/useResponsive";
import { filterSitePosts } from "@/services/nostr/content";

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

interface PinnedNotesProps {
  siteId: string;
  isLoading: boolean;
}

export const PinnedNotes = memo(
  ({ siteId, isLoading: isSideLoading }: PinnedNotesProps) => {
    const [isEdit, setIsEdit] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [dataPinnedNotes, setDataPinnedNotes] = useState<IPinnedNote[]>([]);
    const [originalPinnedNotes, setOriginalPinnedNotes] = useState<
      IPinnedNote[]
    >([]);

    const [options, setOptions] = useState<IPinnedNote[]>([]);

    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

    const handleRemove = (id: string) => {
      const updatedNotes = dataPinnedNotes.filter((note) => note.id !== id);
      setDataPinnedNotes(updatedNotes);
    };

    const handleAction = async () => {
      if (!_.isEqual(dataPinnedNotes, originalPinnedNotes)) {
        setLoading(true);
        console.log("saving", dataPinnedNotes);

        try {
          await savePins(
            siteId,
            dataPinnedNotes.map((p) => p.id),
          );
          setOriginalPinnedNotes(dataPinnedNotes);
          setIsEdit(false);
        } catch (e: any) {
          enqueueSnackbar("Error: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
        }

        setLoading(false);
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

      const newItems = reorder(
        dataPinnedNotes,
        source.index,
        destination.index,
      );

      setDataPinnedNotes(newItems);
    };

    const handleClose = () => {
      setOpen(false);
    };

    const handlePin = (
      _: SyntheticEvent<Element, Event>,
      pinnedNote: IPinnedNote | string | null,
    ) => {
      if (pinnedNote !== null && typeof pinnedNote !== "string") {
        const isAlreadyPinned = dataPinnedNotes.some(
          (note) => note.id === pinnedNote.id,
        );

        if (!isAlreadyPinned) {
          setDataPinnedNotes([pinnedNote, ...dataPinnedNotes]);
        }
      }
    };

    useEffect(() => {
      if (siteId) {
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
      }
    }, [siteId]);

    const fetchData = async (query: string) => {
      try {
        setLoading(true);
        setOptions([]);

        console.log("query", query, siteId);
        const posts = await filterSitePosts(siteId, { search: query });
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

    const debouncedFetchData = useMemo(
      () => debounce(fetchData, 300),
      [siteId],
    );

    useEffect(() => {
      if (inputValue) {
        debouncedFetchData(inputValue);
      } else {
        setOptions([]);
      }
    }, [inputValue, debouncedFetchData, setOptions, siteId]);

    return (
      <StyledSettingBlock id={SETTINGS_CONFIG.pinnedContent.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.pinnedContent.title}
            {!userIsDelegated && (
              <SaveButton
                isEdit={isEdit || isSideLoading}
                isLoading={isLoading || isSideLoading}
                handleAction={handleAction}
              />
            )}
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.pinnedContent.description}
          </StyledDescriptionBlock>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Pin some content to prioritize it on your site
          </Typography>
          {/* requires passing in a site, and might be confusing,
            so we keep "connect keys" separate for now
        {userIsDelegated && (
          <>
            <StyledDescriptionBlock color="red">
              Please connect your Nostr keys to edit the pinned notes!
            </StyledDescriptionBlock>

            <Button
              size="medium"
              variant="outlined"

              onClick={handleConnectKeys}
              fullWidth
            >
              Connect keys
            </Button>
          </>
        )} */}
        </StyledHeadSettingBlock>
        {isLoading && dataPinnedNotes.length === 0 ? (
          <CircularProgress />
        ) : (
          <StyledList>
            {dataPinnedNotes.map((el) => (
              <PinnedNote
                key={el.id}
                id={el.id}
                title={el.title}
                summary={el.summary}
                picture={el.picture}
                datetime={el.datetime}
              />
            ))}
          </StyledList>
        )}

        <StyledDialog onClose={handleClose} open={isOpen}>
          <StyledDialogTitle>
            <StyledTitle variant="body1">
              Manage pinned posts
              <Button
                onClick={handleClose}
                variant="text"
                color="secondary"
                sx={{ minWidth: "auto" }}
              >
                <CrossIcon color="inherit" />
              </Button>
            </StyledTitle>
          </StyledDialogTitle>
          <StyledDialogContent>
            <StyledDescription variant="body2">
              Pin posts to always show them at the top and to mark them as
              featured, if supported by your theme.
            </StyledDescription>
            <Autocomplete
              freeSolo
              disablePortal
              size={sizeField}
              clearIcon={<CrossIcon onClick={() => setInputValue("")} />}
              loading={isLoading}
              loadingText={"Searching..."}
              options={options}
              onChange={handlePin}
              inputValue={inputValue}
              filterOptions={(options) => options}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.title
              }
              renderOption={(props, option) => {
                const isAlreadyPinned = dataPinnedNotes.some(
                  (note) => note.id === option.id,
                );

                return typeof option === "string" ? (
                  option
                ) : (
                  <ListItem
                    sx={{ padding: "0 !important" }}
                    {...props}
                    key={option.id}
                  >
                    <StyledItemWrapDiv>
                      <PinnedNoteContent
                        id={option.id}
                        title={option.title}
                        summary={option.summary}
                        picture={option.picture}
                        datetime={option.datetime}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            size="small"
                          >
                            {isAlreadyPinned ? (
                              <PinFillIcon fontSize="inherit" />
                            ) : (
                              <PinIcon fontSize="inherit" />
                            )}
                          </IconButton>
                        }
                      />
                    </StyledItemWrapDiv>
                  </ListItem>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Search"
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
              <StyledDescriptionBottom variant="body2">
                Drag & drop to change the order
              </StyledDescriptionBottom>
            )}
          </StyledDialogContent>
        </StyledDialog>
      </StyledSettingBlock>
    );
  },
);

PinnedNotes.displayName = "PinnedNotes";
