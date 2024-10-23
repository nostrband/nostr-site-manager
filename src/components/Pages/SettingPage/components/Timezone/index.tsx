import React, { useState } from "react";
import {
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "../../styled";
import { Autocomplete, TextField, Typography } from "@mui/material";
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
    <StyledSettingCol id={HASH_CONFIG.TIMEZONE}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Site timezone</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 4 }}>
          Set the time and date of your publication, used for all published
          posts
        </Typography>

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
    </StyledSettingCol>
  );
};
