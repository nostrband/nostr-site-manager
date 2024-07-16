"use client";
import {
  Autocomplete,
  Button,
  DialogTitle,
  Fab,
  FormControl,
  InputLabel,
  ListItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
} from "@/components/ModalHashtagsKinds/styled";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import React, { useEffect, useState } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export const ModalHashtagsKinds = ({
  isOpen,
  hashtagsSelected,
  kindsSelected,
  kinds,
  hashtags: hashtagsExternal,
  handleChange,
  handleClose,
}: {
  isOpen: boolean;
  hashtagsSelected: string[];
  kindsSelected: number[];
  kinds: { [key: number]: string };
  hashtags: string[];
  handleClose: () => void;
  handleChange: (hashtagsData: string[], kindsData: number[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  // const [kindsSelected, setkinds] = useState<number[]>([]);

  const mergeHashtags = new Set([...hashtags, ...hashtagsSelected]);
  const mergedOptions = Array.from(mergeHashtags).map((el) => ({ title: el }));

  const handleAddHashtag = () => {
    if (inputValue) {
      const newHashtag = inputValue.startsWith("#")
        ? inputValue
        : `#${inputValue}`;
      if (!hashtags.includes(newHashtag)) {
        const newHashtags = [...hashtags, newHashtag];
        setHashtags(newHashtags);
        handleChangeHashtags([...hashtagsSelected, newHashtag]);
        setInputValue("");
      }
    }
  };

  const handleChangeKinds = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    handleChange(
      hashtagsSelected,
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const handleChangeHashtags = (hashtagsData: string[]) => {
    handleChange(hashtagsData, kindsSelected);
  };

  const isSubstringPresent = (value: string) => {
    return hashtags.some((hashtag) => hashtag.includes(value));
  };

  useEffect(() => {
    setHashtags(hashtagsExternal);
  }, [hashtagsExternal]);
  //
  // console.log({kindsSelected})

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Hashtags & Kinds
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
        <FormControl fullWidth sx={{ marginTop: "15px" }}>
          <InputLabel id="demo-multiple-checkbox-label">Kinds</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            fullWidth
            multiple
            value={kindsSelected}
            onChange={handleChangeKinds}
            input={<OutlinedInput label="Kinds" />}
            renderValue={(selected) =>
              selected.map((val) => kinds[val]).join(", ")
            }
          >
            {Object.keys(kinds)
              .map((el) => Number(el))
              .map((kind) => (
                <MenuItem key={kind} value={kind}>
                  <Checkbox checked={kindsSelected.indexOf(kind) > -1} />
                  <ListItemText primary={kinds[kind]} />
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Autocomplete
          sx={{ marginTop: "15px" }}
          multiple
          options={mergedOptions}
          disableCloseOnSelect
          freeSolo
          value={hashtagsSelected}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          onChange={(_, value) => {
            const newHashtag = (s: string) => (s.startsWith("#") ? s : `#${s}`);

            const newValues = value.map((v) =>
              typeof v === "string" ? newHashtag(v) : newHashtag(v.title),
            );
            const uniqueValues = [...new Set(newValues)];
            handleChangeHashtags(uniqueValues);
            setHashtags((prevHashtags) => [
              ...new Set([...prevHashtags, ...uniqueValues]),
            ]);
          }}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.title
          }
          renderOption={(props, option) => {
            // @ts-ignore
            const { key, ...optionProps } = props;
            return (
              <ListItem {...optionProps} key={key}>
                <Checkbox
                  checked={hashtagsSelected.indexOf(option.title) > -1}
                  onClick={(e) => {
                    const isSelected = hashtagsSelected.includes(option.title);
                    if (isSelected) {
                      e.stopPropagation();
                      const newSelectedHashtags = hashtagsSelected.filter(
                        (el) => el !== option.title,
                      );

                      handleChangeHashtags(newSelectedHashtags);
                    }
                  }}
                />
                <ListItemText primary={option.title} />
              </ListItem>
            );
          }}
          renderInput={(params) => <TextField {...params} label="Hashtags" />}
        />
        {inputValue &&
          !hashtags.includes(inputValue) &&
          !isSubstringPresent(inputValue) && (
            <Button
              onClick={handleAddHashtag}
              variant="contained"
              sx={{ mt: 1 }}
            >
              Add {inputValue}
            </Button>
          )}
      </StyledDialogContent>
    </StyledDialog>
  );
};
