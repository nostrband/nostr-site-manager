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
  selectedOptionsMainCallAction: string;
  selectedContentActions: string[];
  handleOptionsMainCallAction: (value: string) => void;
  handleChangeContentActions: (value: string[]) => void;
}

const options = ["Zap", "Like", "Repost", "Share", "Subscribe", "Open with"];

export const Other = ({
  postsPerPage,
  selectedOptionsMainCallAction,
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
      typeof value === "string" ? value.split(",") : value,
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
          <Typography variant="h6">Other</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Control content on pages
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
            value={selectedOptionsMainCallAction}
            label="Main call to action"
            onChange={handleContentActions}
          >
            {options.map((o) => (
              <MenuItem key={o} value={o}>
                <ListItemText primary={o} />
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
            renderValue={(selected) => selected.join(", ")}
          >
            {options.map((o) => (
              <MenuItem key={o} value={o}>
                <Checkbox
                  checked={selectedContentActions.indexOf(o) > -1}
                />
                <ListItemText primary={o} />
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
