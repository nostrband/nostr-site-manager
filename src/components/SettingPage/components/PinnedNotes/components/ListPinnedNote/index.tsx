import React, { FC } from "react";
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { IconButton, List } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { PinnedNote } from "../PinnedNote";
import { IPinnedNote } from "../../types";

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
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {items.map((el, index) => (
                <PinnedNote
                  key={el.id}
                  id={el.id}
                  title={el.title}
                  summary={el.summary}
                  picture={el.picture}
                  index={index}
                  isDragElement={true}
                  secondaryAction={
                    <IconButton
                      onClick={() => handleRemove(el.id)}
                      edge="end"
                      aria-label="delete"
                      color="error"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  }
                />
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    );
  },
);

ListPinnedNote.displayName = "ListPinnedNote";
