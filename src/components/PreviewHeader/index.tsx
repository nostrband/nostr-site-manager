"use client";
import {
  StyledWrapper,
} from "@/components/PreviewHeader/styled";
import { Button, OutlinedInput, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, useSearchParams } from "next/navigation";
import { THEMES_PREVIEW, TYPES_THEMES_TAG } from "@/consts";
import { ModalThemes } from "@/components/ModalThemes";
import { useState } from "react";

export const PreviewHeader = ({
  themeName,
  themeId,
}: {
  themeName: string;
  themeId: string;
}) => {
  const [isOpenModalThemes, setOpenModalThemes] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag") || "";

  const handleChange = (value: string) => {
    const filteredThemeIds = (
      value ? THEMES_PREVIEW.filter((t) => t.tag === value) : THEMES_PREVIEW
    ).map((t) => t.id);
    const newThemeId = filteredThemeIds.includes(themeId)
      ? themeId
      : filteredThemeIds[0];
    console.log("newThemeId", newThemeId, filteredThemeIds.length);

    router.push(
      `/preview?themeId=${newThemeId}${value !== "" ? `&tag=${value}` : ""}`,
    );
  };

  const handleClose = () => {
    setOpenModalThemes(false);
  };

  const handleOpen = () => {
    setOpenModalThemes(true);
  };

  const options = Object.values(TYPES_THEMES_TAG);

  return (
    <>
      <StyledWrapper>
        <Button color="primary" variant="outlined" onClick={handleOpen}>
          Theme:<b>{themeName}</b>
        </Button>

        <Select
          displayEmpty
          value={tag}
          size="small"
          input={<OutlinedInput />}
          renderValue={(selected: string) => {
            if (selected === "") {
              return "All themes";
            }

            return selected;
          }}
        >
          <MenuItem onClick={() => handleChange("")} key="" value="">
            All themes
          </MenuItem>
          {options.map((el) => (
            <MenuItem onClick={() => handleChange(el)} key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </StyledWrapper>
      <ModalThemes
        tag={tag}
        themeId={themeId}
        isOpen={isOpenModalThemes}
        handleClose={handleClose}
      />
    </>
  );
};
