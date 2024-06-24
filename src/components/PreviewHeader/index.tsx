"use client";
import { StyledWrapper } from "@/components/PreviewHeader/styled";
import {OutlinedInput, Select, Typography} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter, useSearchParams } from "next/navigation";
import { TYPES_THEMES_TAG } from "@/consts";

export const PreviewHeader = ({
  themeName,
  themeId,
}: {
  themeName: string;
  themeId: string;
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag") || "";

  const handleChange = (value: string) => {
    router.push(
      `/preview?themeId=${themeId}${value !== tag ? `&tag=${value}` : ""}`,
    );
  };

  const options = Object.values(TYPES_THEMES_TAG);

  return (
    <>
      <StyledWrapper>
        <Typography variant="body1">Theme: <b>{themeName}</b></Typography>

        <Select
          displayEmpty
          value={tag}
          size="small"
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected === "") {
              return <em>Choice a tag</em>;
            }

            return selected;
          }}
        >
          <MenuItem disabled value="">
            <em>Choice a tag</em>
          </MenuItem>
          {options.map((el) => (
            <MenuItem onClick={() => handleChange(el)} key={el} value={el}>
              {el}
            </MenuItem>
          ))}
        </Select>
      </StyledWrapper>
    </>
  );
};
