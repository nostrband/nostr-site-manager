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

export const PinnedNotes = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [dataPinnedNotes, setDataPinnedNotes] = useState<IPinnedNote[]>([]);
  const [originalPinnedNotes, setOriginalPinnedNotes] = useState<IPinnedNote[]>(
    [],
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
    pinnedNote: IPinnedNote | string | null,
  ) => {
    if (pinnedNote !== null && typeof pinnedNote !== "string") {
      const isAlreadyPinned = dataPinnedNotes.some(
        (note) => note.id === pinnedNote.id,
      );

      if (!isAlreadyPinned) {
        setDataPinnedNotes([...dataPinnedNotes, pinnedNote]);
      }
      setInputValue("");
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      const initialData = [
        {
          id: "1",
          title: "Test title",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Test summary test yexy",
        },
        {
          id: "2",
          title: "Test title",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Test summary test yexy",
        },
        {
          id: "3",
          title: "Test title",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Test summary test yexy",
        },
      ];

      setDataPinnedNotes(initialData);
      setOriginalPinnedNotes(initialData);
    }, 2000);
  }, []);

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setOptions([]);

      console.log(query);

      const generatedOptions: IPinnedNote[] = [
        {
          id: "4",
          title: "Fetched title 1",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Fetched summary 1",
        },
        {
          id: "5",
          title: "Fetched title 2",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Fetched summary 2",
        },
        {
          id: "6",
          title: "Fetched title 3",
          picture:
            "https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png",
          summary: "Fetched summary 3",
        },
      ];

      setLoading(false);
      setOptions(generatedOptions);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
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
              Manage pinned notes
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
                  (note) => note.id === option.id,
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
                  placeholder="Search notes"
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
              <Typography variant="body2">
                You can drag&drop items for manage order
              </Typography>
            )}
          </StyledDialogContent>
        </StyledDialog>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
