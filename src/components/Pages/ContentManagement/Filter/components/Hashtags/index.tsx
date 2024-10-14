"use client";

import { fetchTopHashtags } from "@/services/nostr/themes";
import {
  Autocomplete,
  Checkbox,
  createFilterOptions,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const filter = createFilterOptions();

interface IHashtagsFilter {
  contributors: string[];
  handleChangeHashtags: (value: string[]) => void;
  selectedHashtags: string[];
}

export const HashtagsFilter = ({
  contributors,
  selectedHashtags,
  handleChangeHashtags,
}: IHashtagsFilter) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const mergeHashtags = new Set([...hashtags, ...selectedHashtags]);
  const mergedOptions = Array.from(mergeHashtags).map((el) => ({ title: el }));
  const [hashtagsInputValue, setHashtagsInputValue] = useState("");

  const getHashtags = useCallback(async () => {
    const hts = (await fetchTopHashtags(contributors)).map((t) => "#" + t);
    const allHts = [...new Set([...hts, ...selectedHashtags])];
    setHashtags(allHts);
  }, [setHashtags, contributors]);

  useEffect(() => {
    getHashtags().then();
  }, [getHashtags]);

  return (
    <Autocomplete
      multiple
      options={mergedOptions}
      disableCloseOnSelect
      // @ts-ignore
      value={selectedHashtags}
      inputValue={hashtagsInputValue}
      // @ts-ignore
      filterOptions={(options, params) => {
        // @ts-ignore
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
            : // @ts-ignore
              newHashtag(Boolean(v.inputValue) ? v.inputValue : v.title),
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
        const { key, ...optionProps } = props;
        return (
          <ListItem {...optionProps} key={key}>
            {
              // @ts-ignore
              !Boolean(option.inputValue) && (
                <Checkbox
                  checked={selectedHashtags.indexOf(option.title) > -1}
                  onClick={(e) => {
                    const isSelected = selectedHashtags.includes(option.title);

                    if (isSelected) {
                      e.stopPropagation();
                      const newSelectedHashtags = selectedHashtags.filter(
                        (el) => el !== option.title,
                      );

                      handleChangeHashtags(newSelectedHashtags);
                    }
                  }}
                />
              )
            }
            <ListItemText primary={option.title} />
          </ListItem>
        );
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
