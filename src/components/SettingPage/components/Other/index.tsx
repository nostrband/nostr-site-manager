import React, { useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";

interface IOther extends IBaseSetting {
  postsPerPage: string;
  contentActionMain: string;
  selectedContentActions: string[];
  handleOptionsMainCallAction: (value: string) => void;
  handleChangeContentActions: (value: string[]) => void;
}

const options: { [name: string]: string } = {
  zap: "Zap",
  like: "Like",
  bookmark: "Bookmark",
  share: "Share",
  follow: "Follow",
  "open-with": "Open with",
  quote: "Quote",
  comment: "Comment",
  highlight: "Highlight",
};
const mainOptions = ["zap", "like", "bookmark", "share", "follow", "open-with"];

export const Other = ({
  postsPerPage,
  contentActionMain,
  handleChange,
  handleBlur,
  submitForm,
  selectedContentActions,
  handleOptionsMainCallAction,
  handleChangeContentActions,
  isLoading,
}: IOther) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const handleChangeOptions = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    handleChangeContentActions(
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleContentActions = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;

    handleOptionsMainCallAction(value);
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.OTHER}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Other settings</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Other content and plugin settings
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="posts-per-page">Posts per page</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            inputProps={{ type: "number" }}
            id="posts-per-page"
            name="postsPerPage"
            label="Posts per page"
            onChange={handleChange}
            value={postsPerPage}
            onBlur={handleBlur}
          />
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel id="main-call-to-action">Main call to action</InputLabel>
          <Select
            labelId="main-call-to-action"
            id="main-call-to-action"
            value={contentActionMain}
            label="Main call to action"
            onChange={handleContentActions}
          >
            {mainOptions.map((o) => (
              <MenuItem key={o} value={o}>
                <ListItemText primary={options[o]} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel id="demo-multiple-checkbox-label">
            Content actions
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={selectedContentActions}
            onChange={handleChangeOptions}
            input={<OutlinedInput label="Content actions" />}
            renderValue={(selected) =>
              selected.filter((s) => !!s.trim()).map(s => options[s]).join(", ")
            }
          >
            {Object.keys(options).map((o) => (
              <MenuItem key={o} value={o}>
                <Checkbox checked={selectedContentActions.includes(o)} />
                <ListItemText primary={options[o]} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
