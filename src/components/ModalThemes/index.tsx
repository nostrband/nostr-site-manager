"use client";
import {
  DialogTitle,
  Fab,
  List,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
} from "@/components/ModalThemes/styled";
import { useMemo } from "react";
import { THEMES_PREVIEW } from "@/consts";
import ListItemButton from "@mui/material/ListItemButton";
import { useRouter } from "next/navigation";

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

  return (
    <StyledDialog open={isOpen} onClose={handleClose}>
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Choose theme
          <Fab
            onClick={handleCancel}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
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
