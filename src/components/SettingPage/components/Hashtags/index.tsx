import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { InputLabel, OutlinedInput, Typography } from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import {
  fetchTopHashtags,
  getPreviewTopHashtags,
} from "@/services/nostr/themes";

interface ITitleDescription extends IBaseSetting {
  selectedHashtags: string[];
  contributors: string[];
  handleChangeHashtags: (value: string | string[]) => void;
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

  const handleChange = (event: SelectChangeEvent<typeof hashtags>) => {
    const {
      target: { value },
    } = event;
    handleChangeHashtags(typeof value === "string" ? value.split(",") : value);
  };

  const handleClick = () => {
    handleAction().then();
  };

  const getHashtags = useCallback(async () => {
    // const dataHashtags = await getPreviewTopHashtags();
    // const dataHashtags = [
    //   "#cooking",
    //   "#photography",
    //   "#nostr",
    //   "#travel",
    //   "#grownostr",
    // ];
    const hts = await fetchTopHashtags(contributors);
    setHashtags(hts);
  }, [setHashtags, contributors]);

  useEffect(() => {
    getHashtags().then();
  }, [getHashtags]);

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
          <InputLabel id="demo-multiple-checkbox-label">Hashtags</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedHashtags}
            onChange={handleChange}
            input={<OutlinedInput label="Hashtags" />}
            renderValue={(selected) => selected.join(", ")}
          >
            {hashtags.map((hashtag) => (
              <MenuItem key={hashtag} value={hashtag}>
                <Checkbox checked={selectedHashtags.indexOf(hashtag) > -1} />
                <ListItemText primary={hashtag} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
