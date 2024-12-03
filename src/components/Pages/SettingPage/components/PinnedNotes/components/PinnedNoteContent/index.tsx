"use client";
import { Box } from "@mui/material";
import React from "react";
import {
  StyledDateItem,
  StyledIdItem,
  StyledItemAvatar,
  StyledItemHead,
  StyledItemNoAvatar,
  StyledSummary,
  StyledTitleItem,
} from "../PinnedNote/styled";
import { getDateTime } from "../../helpers";
import useImageLoader from "@/hooks/useImageLoader";
import { BrokenIcon } from "@/components/Icons";

interface IPinnedNoteContent {
  secondaryAction?: React.ReactNode;
  title: string;
  picture: string;
  summary: string;
  id: string;
  datetime: string;
}

export const PinnedNoteContent = ({
  title,
  picture,
  summary,
  id,
  datetime,
  secondaryAction,
}: IPinnedNoteContent) => {
  const { isLoaded } = useImageLoader(picture);

  return (
    <>
      <StyledItemHead>
        {isLoaded ? (
          <StyledItemAvatar variant="rounded" alt={title} src={picture}>
            {title[0]}
          </StyledItemAvatar>
        ) : (
          <StyledItemNoAvatar>
            <BrokenIcon fontSize="inherit" />
          </StyledItemNoAvatar>
        )}
        <StyledTitleItem>{title}</StyledTitleItem>
      </StyledItemHead>

      <StyledSummary variant="body2">{summary}</StyledSummary>

      <StyledIdItem variant="body2">
        <small>
          <b>ID:</b> {id}
        </small>
      </StyledIdItem>

      <StyledDateItem variant="body2">
        {getDateTime(datetime)}{" "}
        {secondaryAction ? <Box>{secondaryAction}</Box> : null}
      </StyledDateItem>
    </>
  );
};
