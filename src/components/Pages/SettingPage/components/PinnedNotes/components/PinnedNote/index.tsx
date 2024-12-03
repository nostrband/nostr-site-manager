"use client";
import { Draggable } from "@hello-pangea/dnd";
import { IPinnedNote } from "../../types";
import React from "react";
import { StyledItemWrap } from "./styled";
import { PinnedNoteContent } from "../PinnedNoteContent";

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
            <PinnedNoteContent
              datetime={datetime}
              title={title}
              picture={picture}
              secondaryAction={secondaryAction}
              summary={summary}
              id={id}
            />
          </StyledItemWrap>
        )}
      </Draggable>
    );
  }

  return (
    <StyledItemWrap alignItems="flex-start">
      <PinnedNoteContent
        datetime={datetime}
        title={title}
        picture={picture}
        secondaryAction={secondaryAction}
        summary={summary}
        id={id}
      />
    </StyledItemWrap>
  );
};
