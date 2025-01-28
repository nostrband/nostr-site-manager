"use client";

import { SUPPORTED_KINDS, SUPPORTED_KIND_NAMES } from "@/consts";
import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

interface ITypesFilter {
  handleChangeTypes: (value: number[]) => void;
  selectedTypes: number[];
  label: string;
  id: string;
}

export const TypesFilter = ({
  selectedTypes,
  handleChangeTypes,
  label,
  id,
}: ITypesFilter) => {
  const [types, setTypes] = useState<number[]>([]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const {
      target: { value },
    } = event;
    handleChangeTypes(
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };

  const getKinds = useCallback(async () => {
    const dataKinds = [...SUPPORTED_KINDS];
    setTypes(dataKinds);
  }, []);

  useEffect(() => {
    getKinds().then();
  }, [getKinds]);

  return (
    <>
      <Select
        label={label}
        labelId={id}
        multiple
        value={selectedTypes}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          selected.map((val) => SUPPORTED_KIND_NAMES[val]).join(", ")
        }
      >
        {types.map((kind) => (
          <MenuItem key={kind} value={kind}>
            <Checkbox checked={selectedTypes.indexOf(kind) > -1} />
            <ListItemText primary={SUPPORTED_KIND_NAMES[kind]} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
