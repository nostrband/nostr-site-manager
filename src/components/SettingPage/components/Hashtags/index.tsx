"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  Autocomplete,
  ListItem,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { fetchTopHashtags } from "@/services/nostr/themes";

interface ITitleDescription extends IBaseSetting {
  selectedHashtags: string[];
  contributors: string[];
  handleChangeHashtags: (value: string[]) => void;
}

export const Hashtags = ({
  handleChangeHashtags,
  contributors,
  selectedHashtags,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    setInputValue("");
    handleAction().then();
  };

  const getHashtags = useCallback(async () => {
    const hts = (await fetchTopHashtags(contributors)).map((t) => "#" + t);
    const allHts = [...new Set([...hts, ...selectedHashtags])];
    setHashtags(allHts);
  }, [setHashtags, contributors]);

  useEffect(() => {
    getHashtags().then();
  }, [getHashtags]);

  const mergeHashtags = new Set([...hashtags, ...selectedHashtags]);
  const mergedOptions = Array.from(mergeHashtags).map((el) => ({ title: el }));

  const handleAddHashtag = () => {
    if (inputValue) {
      const newHashtag = inputValue.startsWith("#")
        ? inputValue
        : `#${inputValue}`;
      if (!hashtags.includes(newHashtag)) {
        const newHashtags = [...hashtags, newHashtag];
        setHashtags(newHashtags);
        handleChangeHashtags([...selectedHashtags, newHashtag]);
        setInputValue(""); // Clear the input after adding
      }
    }
  };

  const isSubstringPresent = (value: string) => {
    return hashtags.some((hashtag) => hashtag.includes(value));
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.HASHTAGS}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Hashtags</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Hashtags of published posts
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <Autocomplete
            multiple
            options={mergedOptions}
            disableCloseOnSelect
            disabled={!isEdit}
            freeSolo
            value={selectedHashtags}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) =>
              setInputValue(newInputValue)
            }
            onChange={(_, value) => {
              const newHashtag = (s: string) =>
                s.startsWith("#") ? s : `#${s}`;

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
                    disabled={!isEdit}
                    checked={selectedHashtags.indexOf(option.title) > -1}
                    onClick={(e) => {
                      const isSelected = selectedHashtags.includes(
                        option.title,
                      );
                      if (isSelected) {
                        e.stopPropagation();
                        const newSelectedHashtags = selectedHashtags.filter(
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
            renderInput={(params) => (
              <TextField {...params} disabled={!isEdit} label="Hashtags" />
            )}
          />
          {inputValue &&
            !hashtags.includes(inputValue) &&
            !isSubstringPresent(inputValue) && (
              <Button
                disabled={!isEdit}
                onClick={handleAddHashtag}
                variant="contained"
                sx={{ mt: 1 }}
              >
                Add {inputValue}
              </Button>
            )}
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
