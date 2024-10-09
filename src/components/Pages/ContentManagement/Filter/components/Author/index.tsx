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

export const AuthorFilter = () => {
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const mergeAuthors = new Set([...authors, ...selectedAuthors]);
  const mergedOptions = Array.from(mergeAuthors).map((el) => ({ title: el }));
  const [authorsInputValue, setAuthorsInputValue] = useState("");

  return (
    <Autocomplete
      multiple
      options={mergedOptions}
      disableCloseOnSelect
      freeSolo
      value={selectedAuthors}
      inputValue={authorsInputValue}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.title,
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
        setAuthorsInputValue(newInputValue);
      }}
      onChange={(_, value) => {
        const newHashtag = (s: string) => s;

        const newValues = value.map((v) =>
          typeof v === "string"
            ? newHashtag(v)
            : newHashtag(Boolean(v.inputValue) ? v.inputValue : v.title),
        );

        const uniqueValues = [...new Set(newValues)];
        setSelectedAuthors(uniqueValues);
        setAuthors((prevAuthors) => [
          ...new Set([...prevAuthors, ...uniqueValues]),
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
                checked={selectedAuthors.indexOf(option.title) > -1}
                onClick={(e) => {
                  const isSelected = selectedAuthors.includes(option.title);

                  if (isSelected) {
                    e.stopPropagation();
                    const newSelectedAuthors = selectedAuthors.filter(
                      (el) => el !== option.title,
                    );

                    setSelectedAuthors(newSelectedAuthors);
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
