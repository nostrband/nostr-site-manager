import { FC } from "react";
import { ClientPost } from "../../types";
import { Avatar, Box, Checkbox, Stack, Typography } from "@mui/material";
import { capitalizeFirstLetter } from "../../utils";
import { StyledContainer } from "./styled";
import Link from "next/link";

type ItemProps = ClientPost & {
  checked: boolean;
  onCheckboxChange: () => void;
};

export const ItemPost: FC<ItemProps> = ({
  title,
  summary,
  slug,
  onCheckboxChange,
  checked,
  published_at,
  tags,
  author,
  url,
  conflict,
  type,
}) => {
  const { name, profile_image = "" } = author || {};
  const nameFirstLetter = (name || "").charAt(0).toUpperCase();
  const hasTags = tags.length > 0;
  const renderedTags = tags.map((tag) => `#${tag.slug}`).join(" ");

  const postType = type === "page" ? "Page" : "Post";

  return (
    <StyledContainer>
      <Stack alignItems={"center"}>
        <Avatar src={profile_image || ""}>{nameFirstLetter}</Avatar>
        <Typography width={"75%"} variant="subtitle1" textAlign={"center"}>
          {capitalizeFirstLetter(name || "")}
        </Typography>
      </Stack>

      <Stack flex={1} gap={"0.5rem"}>
        <Typography fontWeight={600}>{title}</Typography>
        <Typography variant="body2">{summary || "N/A"}</Typography>
        <Stack direction={"row"} alignItems={"center"} gap={"1rem"}>
          <Typography variant="subtitle2">{postType}</Typography>
          <Typography variant="subtitle2" color={"GrayText"}>
            {published_at && new Date(published_at).toLocaleDateString()}
          </Typography>
        </Stack>
        {hasTags && <Typography variant="body2">{renderedTags}</Typography>}
        {url && (
          <Link href={url} target="_blank">
            {conflict && <>Conflicts with /{slug}/</>}
            {!conflict && <>Already published</>}
          </Link>
        )}
      </Stack>

      <Box alignSelf={"center"}>
        <Checkbox checked={checked} onChange={onCheckboxChange} />
      </Box>
    </StyledContainer>
  );
};
