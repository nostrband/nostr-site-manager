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

export const TypesFilter = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>(["notes", "long-form", "pages"]);
  const mergeTypes = new Set([...types, ...selectedTypes]);
  const mergedOptions = Array.from(mergeTypes).map((el) => ({ title: el }));
  const [typesInputValue, setTypesInputValue] = useState("");

  return (
    <Autocomplete
      multiple
      options={mergedOptions}
      disableCloseOnSelect
      freeSolo
      value={selectedTypes}
      inputValue={typesInputValue}
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
        setTypesInputValue(newInputValue);
      }}
      onChange={(_, value) => {
        const newHashtag = (s: string) => s;

        const newValues = value.map((v) =>
          typeof v === "string"
            ? newHashtag(v)
            : newHashtag(Boolean(v.inputValue) ? v.inputValue : v.title),
        );

        const uniqueValues = [...new Set(newValues)];
        setSelectedTypes(uniqueValues);
        setTypes((prevTypes) => [...new Set([...prevTypes, ...uniqueValues])]);
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
                checked={selectedTypes.indexOf(option.title) > -1}
                onClick={(e) => {
                  const isSelected = selectedTypes.includes(option.title);

                  if (isSelected) {
                    e.stopPropagation();
                    const newSelectedTypes = selectedTypes.filter(
                      (el) => el !== option.title,
                    );

                    setSelectedTypes(newSelectedTypes);
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
