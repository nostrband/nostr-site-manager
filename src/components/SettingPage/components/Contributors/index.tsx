import React, { useCallback, useEffect, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  Autocomplete,
  Button,
  Checkbox,
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
import { HASH_CONFIG } from "@/consts";
import Avatar from "@mui/material/Avatar";
import {
  StyledAutorProfile,
  StyledAutorProfileGroup,
} from "@/components/SettingPage/components/Contributors/styled";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { nip19 } from "nostr-tools";
import { ModalAuthorContributors } from "@/components/ModalAuthorContributors";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { IBaseSetting } from "@/types/setting.types";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { kindsMap } from "@/consts";
import { fetchTopHashtags } from "@/services/nostr/themes";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { syncContributorsData } from "@/utils";

interface IContributors extends IBaseSetting {
  selectedHashtags: string[];
  contributors: ReturnSettingsSiteDataType["contributors"];
  handleChangeContributors: (
    pubkeys: ReturnSettingsSiteDataType["contributors"],
  ) => void;
  handleChangeHashtags: (value: string[]) => void;
  selectedKinds: number[];
  handleChangeKinds: (value: number[]) => void;
}

export const Contributors = ({
  contributors: dataContributors,
  handleChangeContributors,
  isLoading,
  submitForm,
  handleChangeKinds,
  handleChangeHashtags,
  selectedKinds,
  selectedHashtags,
}: IContributors) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);

  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [contributors, setContributors] = useState<NDKEvent[]>([]);

  const [hashtags, setHashtags] = useState<string[]>([]);
  const [kinds, setKinds] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleAuthor = (pubkeyAuthors: string[] | any) => {
    const syncData = syncContributorsData(pubkeyAuthors, dataContributors);

    handleChangeContributors(syncData);
  };

  const handleClose = () => {
    setOpenModalAuthor(false);
  };

  const handleClick = async () => {
    setInputValue("");
    await handleAction();

    if (!isEdit) {
      setOpenModalAuthor(true);
    }
  };

  const getHashtags = useCallback(async () => {
    const hts = (
      await fetchTopHashtags(dataContributors.map((el) => el.pubkey))
    ).map((t) => "#" + t);
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

  useEffect(() => {
    if (dataContributors.length) {
      fetchProfiles(dataContributors.map((el) => el.pubkey))
        .then((p) => {
          if (p.length) {
            setContributors(p);
          } else {
            setContributors([]);
          }
        })
        .catch(() => {
          setContributors([]);
        });
    } else {
      setContributors([]);
    }
  }, [dataContributors]);

  return (
    <>
      <StyledSettingCol id={HASH_CONFIG.CONTRIBUTORS}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Contributors</Typography>

            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
              text="Change contributors"
            />
          </StyledHeadSettingBlock>

          <StyledAutorProfileGroup>
            {contributors.map((el) => {
              let meta = JSON.parse(el.content);

              const npub = el.pubkey
                ? nip19.npubEncode(el.pubkey).substring(0, 8) + "..."
                : "";
              const name = meta.display_name || meta.name || npub;
              const img = meta.picture || "";

              return (
                <StyledAutorProfile key={el.pubkey}>
                  <Avatar alt={name} src={img} />

                  <Typography variant="body1">{name}</Typography>
                </StyledAutorProfile>
              );
            })}
          </StyledAutorProfileGroup>

          <Typography variant="h6">Content</Typography>

          <Typography variant="body2" sx={{ mb: 1 }}>
            Content based on hashtags of published posts and published event
            kinds
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
              onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
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
      <ModalAuthorContributors
        handleChangeContentContributor={handleChangeContributors}
        dataContributors={dataContributors}
        contributorsEvent={contributors}
        isOpen={isOpenModalAuthor}
        handleClose={handleClose}
        handleAuthor={handleAuthor}
      />
    </>
  );
};
