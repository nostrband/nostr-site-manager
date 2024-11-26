import React, { useState } from "react";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { Autocomplete, TextField } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { IBaseSetting } from "@/types/setting.types";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { HASH_CONFIG, TIMEZONE_LIST } from "@/consts";

interface ITimezone extends IBaseSetting {
  timezone: {
    name: string;
    label: string;
  };
  handleChangeTimezone: (
    value: {
      name: string;
      label: string;
    } | null,
  ) => void;
}

export const Timezone = ({
  timezone,
  handleChangeTimezone,
  submitForm,
  isLoading,
}: ITimezone) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);
  const [inputValue, setInputValue] = useState("");

  return (
    <StyledSettingBlock id={HASH_CONFIG.TIMEZONE}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Site timezone
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          Set the time and date of your publication, used for all published
          posts
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <Autocomplete
        value={timezone.label !== "" ? timezone : null}
        getOptionLabel={(option) => option.label}
        onChange={(
          _,
          newValue: {
            name: string;
            label: string;
          } | null,
        ) => {
          handleChangeTimezone(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        size="small"
        disabled={!isEdit}
        disablePortal
        options={TIMEZONE_LIST}
        renderInput={(params) => <TextField {...params} label="Timezone" />}
        isOptionEqualToValue={(option, value) => option.name === value.name}
      />
    </StyledSettingBlock>
  );
};
