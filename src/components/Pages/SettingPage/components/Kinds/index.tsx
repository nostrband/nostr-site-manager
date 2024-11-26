import React, { useCallback, useEffect, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG, SUPPORTED_KIND_NAMES } from "@/consts";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

interface ITitleDescription extends IBaseSetting {
  selectedKinds: number[];
  handleChangeKinds: (value: number[]) => void;
}

export const Kinds = ({
  handleChangeKinds,
  selectedKinds,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);
  const [kinds, setKinds] = useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    handleChangeKinds(
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const handleClick = () => {
    handleAction().then();
  };

  const getKinds = useCallback(async () => {
    const dataKinds = [1, 30023];
    setKinds(dataKinds);
  }, []);

  useEffect(() => {
    getKinds().then();
  }, [getKinds]);

  return (
    <StyledSettingBlock id={HASH_CONFIG.KINDS}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          Kinds
          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>Published event kinds</StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <FormControl disabled={!isEdit} fullWidth size="small">
        <InputLabel id="demo-multiple-checkbox-label">Kinds</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedKinds}
          onChange={handleChange}
          input={<OutlinedInput label="Kinds" />}
          renderValue={(selected) =>
            selected.map((val) => SUPPORTED_KIND_NAMES[val]).join(", ")
          }
        >
          {kinds.map((kind, i) => (
            <MenuItem key={i} value={kind}>
              <Checkbox checked={selectedKinds.indexOf(kind) > -1} />
              <ListItemText primary={SUPPORTED_KIND_NAMES[kind]} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StyledSettingBlock>
  );
};
