"use client";

import { fetchProfiles, searchProfiles } from "@/services/nostr/api";
import {
  Autocomplete,
  Avatar,
  Checkbox,
  createFilterOptions,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material";
import { nip19 } from "nostr-tools";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

interface IAuthorFilter {
  contributors: string[];
  handleChangeAuthors: (value: OptionAuthorType[]) => void;
  selectedAuthors: OptionAuthorType[];
  label: string;
  id: string;
  size: "small" | "medium";
}

export type OptionAuthorType = {
  title: string;
  id: string;
  inputValue: string;
  img: string;
  pubkey: string;
};

const filter = createFilterOptions<OptionAuthorType>();

export const AuthorFilter = ({
  contributors,
  selectedAuthors,
  handleChangeAuthors,
  label,
  id,
  size,
}: IAuthorFilter) => {
  const [authors, setAuthors] = useState<OptionAuthorType[]>([]);
  const [authorsInputValue, setAuthorsInputValue] = useState("");
  const [optionsDataAuthor, setOptionsDataAuthor] = useState<
    { id: string; pubkey: string; name: string; img: string }[]
  >([]);
  const [isLoading, setLoading] = useState(false);
  const [fetchValueAuthor, setFetchValueAuthor] = useState("");

  const mergeAuthors = [...authors, ...selectedAuthors].filter(
    (author, index, self) =>
      index === self.findIndex((a) => a.id === author.id),
  );

  useEffect(() => {
    if (contributors.length) {
      fetchProfiles(contributors)
        .then((profiles) => {
          if (profiles.length) {
            const dataAuthors = profiles.map((author) => {
              let meta;

              try {
                meta = JSON.parse(author.content);
              } catch (error) {
                console.error("Error parsing author content:", error);
                meta = {};
              }

              const npub = author.pubkey
                ? nip19.npubEncode(author.pubkey).substring(0, 8) + "..."
                : "";
              const name = meta.display_name || meta.name || npub;
              const img = meta.picture || "";

              return {
                img,
                title: name,
                id: author.id,
                inputValue: "",
                pubkey: author.pubkey,
              };
            });

            setAuthors(dataAuthors);
          } else {
            setAuthors([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching profiles:", error);
          setAuthors([]);
        });
    } else {
      setAuthors([]);
    }
  }, [contributors]);

  const handleInputChange = (
    _: React.ChangeEvent<{}>,
    newInputValue: string,
  ) => {
    setAuthorsInputValue(newInputValue);
  };

  const handleChange = (
    _: React.ChangeEvent<{}>,
    value: (OptionAuthorType | string)[],
  ) => {
    const newValues = value as OptionAuthorType[];

    function removeDuplicatesById<T extends { id: string }>(array: T[]): T[] {
      const uniqueItems = array.reduce((acc, current) => {
        if (!acc.some((item) => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, [] as T[]);

      return uniqueItems;
    }

    const uniqueNewValues = removeDuplicatesById(newValues);

    handleChangeAuthors([
      ...uniqueNewValues.map((author) => ({
        id: author.id,
        title: author.inputValue ? author.inputValue : author.title,
        img: author.img,
        inputValue: "",
        pubkey: author.pubkey,
      })),
    ]);

    setAuthors((prevAuthors) => [
      ...prevAuthors,
      ...uniqueNewValues
        .filter((newAuthor: OptionAuthorType) =>
          prevAuthors.every(
            (author: OptionAuthorType) => author.id !== newAuthor.id,
          ),
        )
        .map((author) => ({
          id: author.id,
          title: author.inputValue ? author.inputValue : author.title,
          img: author.img,
          inputValue: "",
          pubkey: author.pubkey,
        })),
    ]);
  };

  const fetchData = async (query: string) => {
    try {
      setLoading(true);
      setOptionsDataAuthor([]);
      const profiles = await searchProfiles(query);

      const options = profiles
        .map((e) => {
          try {
            const meta = JSON.parse(e.content);
            return {
              id: e.id,
              pubkey: e.pubkey,
              name: meta?.display_name || meta?.name || e.pubkey,
              img: meta?.picture || "",
            };
          } catch {
            return undefined;
          }
        })
        .filter((p) => !!p);

      setLoading(false);

      setOptionsDataAuthor(options);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchData = useMemo(() => debounce(fetchData, 300), []);

  useEffect(() => {
    if (fetchValueAuthor) {
      debouncedFetchData(fetchValueAuthor);
    } else {
      setOptionsDataAuthor([]);
    }
  }, [fetchValueAuthor, debouncedFetchData, setOptionsDataAuthor]);

  return (
    <Autocomplete
      id={id}
      multiple
      disableClearable
      loading={isLoading}
      options={mergeAuthors}
      disableCloseOnSelect
      limitTags={1}
      freeSolo
      size={size}
      value={selectedAuthors}
      inputValue={authorsInputValue}
      filterOptions={(options, params) => {
        let filtered = filter(options, params);

        const { inputValue } = params;

        const isExisting = options.some(
          (option) => inputValue === option.title,
        );

        if (inputValue !== "" && !isExisting) {
          setFetchValueAuthor(inputValue);

          filtered = [
            ...filtered,
            ...optionsDataAuthor.map((el) => ({
              inputValue: el.name,
              title: `Add "${el.name}"`,
              img: el.img,
              id: el.id,
              pubkey: el.pubkey,
            })),
          ];
        }

        return filtered as OptionAuthorType[];
      }}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.title
      }
      renderOption={(props, option) => (
        <ListItem
          {...props}
          key={option.id}
          onClick={(e) => {
            e.stopPropagation();
            const isSelected = selectedAuthors.some(
              (selected) => selected.title === option.title,
            );

            if (!Boolean(option.inputValue)) {
              if (isSelected) {
                const newSelectedAuthors = selectedAuthors.filter(
                  (el) => el.title !== option.title,
                );
                handleChangeAuthors(newSelectedAuthors);
              } else {
                handleChangeAuthors([...selectedAuthors, option]);
              }
            } else {
              handleChange(e, [...selectedAuthors, option]);
              setAuthorsInputValue("");
            }
          }}
        >
          {!Boolean(option.inputValue) && (
            <Checkbox
              checked={selectedAuthors.some(
                (selected) => selected.title === option.title,
              )}
            />
          )}
          <ListItemAvatar>
            <Avatar alt={option.title} src={option.img} />
          </ListItemAvatar>
          <ListItemText primary={option.title} />
        </ListItem>
      )}
      renderInput={(params) => <TextField label={label} {...params} />}
    />
  );
};
