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
  SelectChangeEvent,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { fetchTopHashtags } from "@/services/nostr/themes";

interface ITitleDescription extends IBaseSetting {
  selectedHashtags: string[];
  contributors: string[];
  handleChangeHashtags: (value: string[]) => void;
  anchor: string;
  selectedKinds: number[];
  handleChangeKinds: (value: number[]) => void;
}

const kindsMap: { [key: number]: string } = {
  1: "Notes",
  30023: "Long-form posts",
};

export const Content = ({
  handleChangeHashtags,
  contributors,
  selectedHashtags,
  submitForm,
  isLoading,
  anchor,
  selectedKinds,
  handleChangeKinds,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [kinds, setKinds] = useState<number[]>([]);
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
        setInputValue("");
      }
    }
  };

  const isSubstringPresent = (value: string) => {
    return hashtags.some((hashtag) => hashtag.includes(value));
  };

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    handleChangeKinds(
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const getKinds = useCallback(async () => {
    const dataKinds = [1, 30023];
    setKinds(dataKinds);
  }, []);

  useEffect(() => {
    getKinds().then();
  }, [getKinds]);

  return (
    <StyledSettingCol id={anchor}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Content</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Content based on hashtags of published posts and published event kinds
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

        <StyledFormControl disabled={!isEdit} fullWidth size="medium">
          <InputLabel id="demo-multiple-checkbox-label">Kinds</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedKinds}
            onChange={handleChange}
            input={<OutlinedInput disabled={!isEdit} label="Kinds" />}
            renderValue={(selected) =>
              selected.map((val) => kindsMap[val]).join(", ")
            }
          >
            {kinds.map((kind) => (
              <MenuItem key={kind} value={kind}>
                <Checkbox checked={selectedKinds.indexOf(kind) > -1} />
                <ListItemText primary={kindsMap[kind]} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
