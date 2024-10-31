"use client";

import {
  Checkbox,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const kindsMap: { [key: number]: string } = {
  1: "Notes",
  30023: "Long-form posts",
};

interface ITypesFilter {
  handleChangeTypes: (value: number[]) => void;
  selectedTypes: number[];
}

export const TypesFilter = ({
  selectedTypes,
  handleChangeTypes,
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
    const dataKinds = [1, 30023];
    setTypes(dataKinds);
  }, []);

  useEffect(() => {
    getKinds().then();
  }, [getKinds]);

  return (
    <>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selectedTypes}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) =>
          selected.map((val) => kindsMap[val]).join(", ")
        }
      >
        {types.map((kind) => (
          <MenuItem key={kind} value={kind}>
            <Checkbox checked={selectedTypes.indexOf(kind) > -1} />
            <ListItemText primary={kindsMap[kind]} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
