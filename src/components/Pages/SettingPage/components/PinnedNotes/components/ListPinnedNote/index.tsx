import React, { FC } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { IconButton } from "@mui/material";
import { PinnedNote } from "../PinnedNote";
import { IPinnedNote } from "../../types";
import { StyledList } from "../../styled";
import { TrashIcon } from "@/components/Icons";

export type Props = {
  items: IPinnedNote[];
  onDragEnd: OnDragEndResponder;
  handleRemove: (id: string) => void;
};

export const ListPinnedNote: FC<Props> = React.memo(
  ({ items, onDragEnd, handleRemove }) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {(provided) => (
            <StyledList ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((el, index) => (
                <PinnedNote
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  summary={el.summary}
                  picture={el.picture}
                  datetime={el.datetime}
                  index={index}
                  isDragElement={true}
                  secondaryAction={
                    <IconButton
                      onClick={() => handleRemove(el.id)}
                      edge="end"
                      aria-label="delete"
                      color="error"
                      size="small"
                    >
                      <TrashIcon fontSize="inherit" />
                    </IconButton>
                  }
                />
              ))}
              {provided.placeholder}
            </StyledList>
          )}
        </Droppable>
      </DragDropContext>
    );
  },
);

ListPinnedNote.displayName = "ListPinnedNote";
