/* eslint-disable */
// @ts-nocheck
"use client";

import {
  Autocomplete,
  Checkbox,
  createFilterOptions,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useState } from "react";

const filter = createFilterOptions();

export const HashtagsFilter = () => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const mergeHashtags = new Set([...hashtags, ...selectedHashtags]);
  const mergedOptions = Array.from(mergeHashtags).map((el) => ({ title: el }));
  const [hashtagsInputValue, setHashtagsInputValue] = useState("");
  console.log({ hashtags });
  return (
    <Autocomplete
      multiple
      options={mergedOptions}
      disableCloseOnSelect
      freeSolo
      value={selectedHashtags}
      inputValue={hashtagsInputValue}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some(
          (option) => `#${inputValue}` === option.title,
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      onInputChange={(_, newInputValue) => {
        setHashtagsInputValue(newInputValue);
      }}
      onChange={(_, value) => {
        const newHashtag = (s: string) => (s.startsWith("#") ? s : `#${s}`);

        const newValues = value.map((v) =>
          typeof v === "string"
            ? newHashtag(v)
            : newHashtag(Boolean(v.inputValue) ? v.inputValue : v.title),
        );

        const uniqueValues = [...new Set(newValues)];
        setSelectedHashtags(uniqueValues);
        setHashtags((prevHashtags) => [
          ...new Set([...prevHashtags, ...uniqueValues]),
        ]);
      }}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.title
      }
      renderOption={(props, option) => {
        // @ts-ignore
        console.log({ option });
        const { key, ...optionProps } = props;
        return (
          <ListItem {...optionProps} key={key}>
            {!Boolean(option.inputValue) && (
              <Checkbox
                checked={selectedHashtags.indexOf(option.title) > -1}
                onClick={(e) => {
                  const isSelected = selectedHashtags.includes(option.title);

                  if (isSelected) {
                    e.stopPropagation();
                    const newSelectedHashtags = selectedHashtags.filter(
                      (el) => el !== option.title,
                    );

                    setSelectedHashtags(newSelectedHashtags);
                  }
                }}
              />
            )}
            <ListItemText primary={option.title} />
          </ListItem>
        );
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
