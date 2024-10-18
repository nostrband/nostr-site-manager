"use client";
import { Draggable } from "@hello-pangea/dnd";
import { Chip } from "@mui/material";
import { IPinnedNote } from "../../types";
import React from "react";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import {
  StyledIdItem,
  StyledItemAvatar,
  StyledItemWrap,
  StyledSecondaryAction,
  StyledSummary,
  StyledTitleItem,
  StyledWrapInfo,
} from "./styled";
import { getDateTime } from "../../helpers";

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
  datetime,
  secondaryAction,
  index,
  isDragElement = false,
}: PinnedNoteItem) => {
  if (isDragElement && typeof index === "number") {
    return (
      <Draggable draggableId={id} index={index}>
        {(provided, snapshot) => (
          <StyledItemWrap
            alignItems="flex-start"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{
              cursor: "grab",
              opacity: snapshot.isDragging ? "0.5" : "1",
            }}
          >
            <StyledItemAvatar variant="rounded" alt={title} src={picture}>
              <InsertPhotoOutlinedIcon />
            </StyledItemAvatar>

            <StyledWrapInfo>
              <StyledTitleItem>{title}</StyledTitleItem>
              <StyledSummary variant="body2">{summary}</StyledSummary>
              <Chip
                size="small"
                icon={<AccessTimeOutlinedIcon />}
                label={getDateTime(datetime)}
              />
              <StyledIdItem variant="body2">
                <small>{id}</small>
              </StyledIdItem>

              {secondaryAction ? (
                <StyledSecondaryAction>{secondaryAction}</StyledSecondaryAction>
              ) : null}
            </StyledWrapInfo>
          </StyledItemWrap>
        )}
      </Draggable>
    );
  }

  return (
    <StyledItemWrap alignItems="flex-start">
      <StyledItemAvatar variant="rounded" alt={title} src={picture}>
        <InsertPhotoOutlinedIcon />
      </StyledItemAvatar>

      <StyledWrapInfo>
        <StyledTitleItem>{title}</StyledTitleItem>
        <StyledSummary variant="body2">{summary}</StyledSummary>
        <Chip
          size="small"
          icon={<AccessTimeOutlinedIcon />}
          label={getDateTime(datetime)}
        />
        <StyledIdItem variant="body2">
          <small>{id}</small>
        </StyledIdItem>

        {secondaryAction ? (
          <StyledSecondaryAction>{secondaryAction}</StyledSecondaryAction>
        ) : null}
      </StyledWrapInfo>
    </StyledItemWrap>
  );
};
