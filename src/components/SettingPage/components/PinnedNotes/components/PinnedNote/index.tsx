"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { IPinnedNote } from "../../types";
import React from "react";

interface PinnedNoteItem extends IPinnedNote {
  secondaryAction?: React.ReactNode;
  index?: number;
  isDragElement?: boolean;
}

export const PinnedNote = ({
  title,
  picture,
  summary,
  id,
  secondaryAction,
  index,
  isDragElement = false,
}: PinnedNoteItem) => {
  if (isDragElement && typeof index === "number") {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <ListItem
            alignItems="flex-start"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              cursor: "grab",
              borderBottom: "1px solid #ececec",
              background: snapshot.isDragging ? "rgb(235,235,235)" : "",
            }}
            secondaryAction={secondaryAction}
          >
            <ListItemAvatar>
              <Avatar alt={title} src={picture} />
            </ListItemAvatar>
            <ListItemText primary={`${id} - ${title}`} secondary={summary} />
          </ListItem>
        )}
      </Draggable>
    );
  }

  return (
    <ListItem
      alignItems="flex-start"
      sx={{ px: 0, borderBottom: "1px solid #ececec" }}
      secondaryAction={secondaryAction}
    >
      <ListItemAvatar>
        <Avatar alt={title} src={picture} />
      </ListItemAvatar>
      <ListItemText primary={`${id} - ${title}`} secondary={summary} />
    </ListItem>
  );
};
