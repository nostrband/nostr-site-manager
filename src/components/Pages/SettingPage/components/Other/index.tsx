import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";
import useResponsive from "@/hooks/useResponsive";

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
  dm: "Direct Message",
};

// NOTE: some of above options can't be main: comment, hightlight, quote
const mainOptions = [
  "zap",
  "like",
  "bookmark",
  "share",
  "follow",
  "open-with",
  "dm",
];

export const Other = memo(
  ({
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

    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

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
      <StyledSettingBlock id={SETTINGS_CONFIG.other.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.other.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.other.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFormFields>
          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
          </FormControl>

          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
            <InputLabel id="main-call-to-action">
              Main call to action
            </InputLabel>
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
          </FormControl>

          <FormControl disabled={!isEdit} fullWidth size={sizeField}>
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
                selected
                  .filter((s) => !!s.trim())
                  .map((s) => options[s])
                  .join(", ")
              }
            >
              {Object.keys(options).map((o) => (
                <MenuItem key={o} value={o}>
                  <Checkbox checked={selectedContentActions.includes(o)} />
                  <ListItemText primary={options[o]} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledFormFields>
      </StyledSettingBlock>
    );
  },
);

Other.displayName = "Other";
