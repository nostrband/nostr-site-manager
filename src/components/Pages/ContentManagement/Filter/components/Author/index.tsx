"use client";

import { fetchProfiles } from "@/services/nostr/api";
import {
  Autocomplete,
  Checkbox,
  createFilterOptions,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import { nip19 } from "nostr-tools";
import { useEffect, useState } from "react";

const filter = createFilterOptions();

interface IAuthorFilter {
  contributors: string[];
}

type OptionType = {
  title: string;
  id: string;
  inputValue: string;
  img: string;
};

export const AuthorFilter = ({ contributors }: IAuthorFilter) => {
  const [selectedAuthors, setSelectedAuthors] = useState<OptionType[]>([]);
  const [authors, setAuthors] = useState<OptionType[]>([]);
  const [authorsInputValue, setAuthorsInputValue] = useState("");

  const mergeAuthors = [...authors, ...selectedAuthors].filter(
    (author, index, self) =>
      index === self.findIndex((a) => a.id === author.id)
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

              return { img, title: name, id: author.id, inputValue: "" };
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
    newInputValue: string
  ) => {
    setAuthorsInputValue(newInputValue);
  };

const handleChange = (
  _: React.ChangeEvent<{}>, 
  value: (OptionType | string)[]
) => {
  const newValues = value as OptionType[]

  setSelectedAuthors(newValues);

  setAuthors((prevAuthors) => [
    ...prevAuthors,
    ...newValues
      .filter((newAuthor: OptionType) =>
        prevAuthors.every((author: OptionType) => author.title !== newAuthor.title)
      )
      .map((author) => ({ id: "", title: author.title, img: "", inputValue: "" })),
  ]);
};

  return (
    <Autocomplete
      multiple
      options={mergeAuthors}
      disableCloseOnSelect
      freeSolo
      value={selectedAuthors}
      inputValue={authorsInputValue}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }
        return filtered;
      }}
      onInputChange={handleInputChange}
      onChange={handleChange}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.title
      }
      renderOption={(props, option) => (
        <ListItem {...props} key={option.id}>
          {!Boolean(option.inputValue) && (
            <Checkbox
              checked={selectedAuthors.some(
                (selected) => selected.title === option.title
              )}
              onClick={(e) => {
                e.stopPropagation();
                const isSelected = selectedAuthors.some(
                  (selected) => selected.title === option.title
                );

                if (isSelected) {
                  const newSelectedAuthors = selectedAuthors.filter(
                    (el) => el.title !== option.title
                  );
                  setSelectedAuthors(newSelectedAuthors);
                } else {
                  setSelectedAuthors((prev) => [
                    ...prev,
                    option,
                  ]);
                }
              }}
            />
          )}
          <ListItemText primary={option.title} />
        </ListItem>
      )}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
