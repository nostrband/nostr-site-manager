"use client";
import {
  Fab,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Select,
  OutlinedInput,
  Box,
} from "@mui/material";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledEndIcon,
} from "@/components/ModalThemes/styled";
import React, { useMemo } from "react";
import { THEMES_PREVIEW, TYPES_THEMES_TAG } from "@/consts";
import ListItemButton from "@mui/material/ListItemButton";
import { useRouter, useSearchParams } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import { CrossIcon } from "../Icons";

export const ModalThemes = ({
  isOpen,
  themeId,
  handleClose,
}: {
  isOpen: boolean;
  themeId: string;
  handleClose: () => void;
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag") || "";
  const siteId = params.get("siteId") || "";

  const filteredData = useMemo(
    () =>
      tag ? THEMES_PREVIEW.filter((item) => item.tag === tag) : THEMES_PREVIEW,
    [tag],
  );

  const handleCancel = () => {
    handleClose();
  };

  const handleNavigate = (id: string) => {
    const searchParams = new URLSearchParams(params.toString());
    if (tag) {
      searchParams.set("tag", tag);
    } else {
      searchParams.delete("tag");
    }

    if (siteId) {
      searchParams.set("siteId", siteId);
    } else {
      searchParams.delete("siteId");
    }

    searchParams.set("themeId", id);

    router.push(`/preview?${searchParams.toString()}`);
    handleCancel();
  };

  const handleTagChange = (newTag: string) => {
    const searchParams = new URLSearchParams(params.toString());

    const filteredThemeIds = (
      newTag ? THEMES_PREVIEW.filter((t) => t.tag === newTag) : THEMES_PREVIEW
    ).map((t) => t.id);
    const newThemeId = filteredThemeIds.includes(themeId)
      ? themeId
      : filteredThemeIds[0];
    console.log("newThemeId", newThemeId, filteredThemeIds.length);

    if (newTag) {
      searchParams.set("tag", newTag);
    } else {
      searchParams.delete("tag");
    }

    if (siteId) {
      searchParams.set("siteId", siteId);
    } else {
      searchParams.delete("siteId");
    }

    searchParams.set("themeId", newThemeId);

    router.push(`/preview?${searchParams.toString()}`);
  };

  const options = Object.values(TYPES_THEMES_TAG);

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <StyledDialogTitle>
        <Box>
          <StyledTitle variant="body1">Choose theme</StyledTitle>
          <Select
            displayEmpty
            IconComponent={StyledEndIcon}
            value={tag}
            size="small"
            sx={{ svg: { color: "#292C34" } }}
            input={<OutlinedInput />}
            renderValue={(selected: string) => {
              if (selected === "") {
                return "All themes";
              }

              return selected;
            }}
          >
            <MenuItem onClick={() => handleTagChange("")} key="" value="">
              All themes
            </MenuItem>
            {options.map((el, i) => (
              <MenuItem onClick={() => handleTagChange(el)} key={i} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Fab onClick={handleCancel} size="small" aria-label="close">
          <CrossIcon />
        </Fab>
      </StyledDialogTitle>
      <StyledDialogContent>
        <List sx={{ width: "100%" }}>
          {filteredData.map((el, i) => {
            const isSelected = el.id === themeId;

            return (
              <ListItemButton
                key={i}
                selected={isSelected}
                alignItems="flex-start"
                sx={{ gap: "10px" }}
                onClick={() => handleNavigate(el.id)}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      width: 170,
                      height: 100,
                      boxShadow: "0px 3px 8px 0px #00000026",
                      borderRadius: "10px",
                    }}
                    variant="square"
                    alt={el.name}
                    src={el.preview.src}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={<b>{el.name}</b>}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        #{el.tag}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </StyledDialogContent>
    </StyledDialog>
  );
};
