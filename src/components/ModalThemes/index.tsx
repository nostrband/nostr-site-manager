"use client";
import {
  DialogTitle,
  Fab,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography, Select, OutlinedInput, Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent, StyledDialogTitle,
} from "@/components/ModalThemes/styled";
import React, { useMemo } from "react";
import {THEMES_PREVIEW, TYPES_THEMES_TAG} from "@/consts";
import ListItemButton from "@mui/material/ListItemButton";
import { useRouter } from "next/navigation";
import {ExpandMoreTwoTone as ExpandMoreTwoToneIcon} from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";

export const ModalThemes = ({
  isOpen,
  tag,
  themeId,
  handleClose,
}: {
  isOpen: boolean;
  tag: string;
  themeId: string;
  handleClose: () => void;
}) => {
  const router = useRouter();

  const filteredData = useMemo(
    () =>
      Boolean(tag)
        ? THEMES_PREVIEW.filter((item) => item.tag === tag)
        : THEMES_PREVIEW,
    [tag],
  );

  const handleCancel = () => {
    handleClose();
  };

  const handleNavigate = (id: string) => {
    router.push(`/preview?themeId=${id}${tag ? `&tag=${tag}` : ""}`);
    handleCancel();
  };

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

  const options = Object.values(TYPES_THEMES_TAG);

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <StyledDialogTitle>
        <Box>
          <StyledTitle variant="body1">
            Choose theme
          </StyledTitle>
          <Select
              displayEmpty
              IconComponent={ExpandMoreTwoToneIcon}
              value={tag}
              size="small"
              color="primary"
              sx={{ svg: { color: "#292C34" } }}
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
        </Box>

        <Fab
            onClick={handleCancel}
            size="small"
            color="primary"
            aria-label="close"
        >
          <CloseIcon />
        </Fab>
      </StyledDialogTitle>
      <StyledDialogContent>




        <List sx={{ width: "100%" }}>
          {filteredData.map((el) => {
            const isSelected = el.id === themeId;

            return (
              <ListItemButton
                key={el.id}
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
