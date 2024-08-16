"use client";
import { kindsMap } from "@/consts";
import { fetchTopHashtags } from "@/services/nostr/themes";
import {
  ContributorType,
  ReturnSettingsSiteDataType,
} from "@/services/sites.service";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export const ContributorContent = ({
  pubkey,
  content,
  dataContributors,
  handleChangeContentContributor,
}: {
  content: ContributorType;
  pubkey: string;
  dataContributors: ReturnSettingsSiteDataType["contributors"];
  handleChangeContentContributor: (
    contributors: ReturnSettingsSiteDataType["contributors"],
  ) => void;
}) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [kinds, setKinds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

  const selectedHashtags = content.hashtags;
  const selectedKinds = content.kinds;

  const getHashtags = useCallback(async () => {
    const hts = (await fetchTopHashtags([pubkey])).map((t) => "#" + t);
    const allHts = [...new Set([...hts, ...selectedHashtags])];
    setHashtags(allHts);
  }, [setHashtags]);

  useEffect(() => {
    getHashtags().then();
  }, [getHashtags]);

  const mergeHashtags = new Set([...hashtags, ...selectedHashtags]);
  const mergedOptions = Array.from(mergeHashtags).map((el) => ({ title: el }));

  const handleChangeHashtags = (value: string[]) => {
    const index = dataContributors.findIndex((c) => c.pubkey === pubkey);

    dataContributors[index].hashtags = value;

    handleChangeContentContributor(dataContributors);
  };

  const handleChangeKinds = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;

    const index = dataContributors.findIndex((c) => c.pubkey === pubkey);

    dataContributors[index].kinds =
      typeof value === "string" ? value.split(",").map(Number) : value;

    handleChangeContentContributor(dataContributors);
  };

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

  const getKinds = useCallback(async () => {
    const dataKinds = [1, 30023];
    setKinds(dataKinds);
  }, []);

  useEffect(() => {
    getKinds().then();
  }, [getKinds]);

  return (
    <div>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Content
      </Typography>

      <FormControl sx={{ mb: 1 }} fullWidth size="small">
        <Autocomplete
          multiple
          options={mergedOptions}
          disableCloseOnSelect
          freeSolo
          value={selectedHashtags}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
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
      </FormControl>

      <FormControl sx={{ mb: 3 }} fullWidth size="medium">
        <InputLabel id="demo-multiple-checkbox-label">Kinds</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedKinds}
          onChange={handleChangeKinds}
          input={<OutlinedInput label="Kinds" />}
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
      </FormControl>
    </div>
  );
};
