"use client";
import { styled } from "@mui/material/styles";
import {
  Box,
  Card,
  CardProps,
  CardActionArea,
  CardHeader,
  CardMedia,
  CardMediaProps,
  Typography,
  CardContent,
  AvatarGroup,
} from "@mui/material";
import { forwardRef } from "react";
import { grey } from "@mui/material/colors";

interface ICard {
  isLink?: boolean;
}

export type IStyledCard = ICard & CardProps;

interface ICardMedia {
  alt?: string;
}

export type IStyledCardMedia = ICardMedia & CardMediaProps;

const CARD_PADDING = 16;
export const CARD_MEDIA_HEIGHT = 160;
const AUTHORS_CONTENT_SPACING = CARD_PADDING;

export const StyledCard = styled(
  forwardRef<HTMLDivElement, IStyledCard>(function CardName(props, ref) {
    const exclude = new Set(["isLink"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Card ref={ref} {...omitProps} />;
  }),
)(({ isLink = false, theme }) => ({
  width: "100%",
  height: "100%",
  display: isLink ? "block" : "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[0],
  padding: isLink ? 0 : CARD_PADDING,
  "&:hover": {
    boxShadow: isLink ? theme.shadows[10] : "none",
  },
}));

export const StyledCardActionArea = styled(CardActionArea)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "baseline",
  padding: CARD_PADDING,
  "&:hover": {
    ".MuiCardActionArea-focusHighlight": {
      opacity: 0,
    },
  },
}));

export const StyledCardNoImage = styled(Box)(({ theme }) => ({
  flex: `0 0 ${CARD_MEDIA_HEIGHT}px`,
  background: grey[300],
  display: "flex",
  height: CARD_MEDIA_HEIGHT,
  width: "100%",
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  fontSize: 60,
  color: "#fff",
}));

export const StyledCardMedia = styled(
  forwardRef<HTMLImageElement, IStyledCardMedia>(
    function CardMediaName(props, ref) {
      return <CardMedia ref={ref} {...props} />;
    },
  ),
)(({ theme }) => ({
  flex: `0 0 ${CARD_MEDIA_HEIGHT}px`,
  height: CARD_MEDIA_HEIGHT,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

export const StyledWrapFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
  borderBottomLeftRadius: theme.shape.borderRadius,
  borderBottomRightRadius: theme.shape.borderRadius,
}));

export const StyledCardHeader = styled(CardHeader)(() => ({
  width: "100%",
  span: {
    width: "inherit",
  },
  padding: 0,
  ".MuiCardHeader-avatar": {
    marginRight: AUTHORS_CONTENT_SPACING,
  },
  ".MuiCardHeader-content": {
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    gap: 4,
  },
}));

export const StyledCardHeaderWrap = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  paddingBottom: CARD_PADDING,
  width: "100%",
  alignItems: "center",
}));

export const StyledCardTitle = styled(Typography)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  height: "18px",
}));

export const StyledCardTitleWrap = styled(Box)(() => ({
  display: "flex",
  alignItems: "start",
}));

export const StyledCardSubHeader = styled(Typography)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  height: "18px",
}));

export const StyledCardDescription = styled(Typography)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
}));

export const StyledCardContent = styled(CardContent)(() => ({
  paddingBottom: 0,
}));

export const StyledCardWrapAuthors = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: AUTHORS_CONTENT_SPACING,
  marginTop: "auto",
  padding: CARD_PADDING,
}));

export const StyledCardAuthorName = styled(Typography)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  color: "inherit",
}));

export const StyledCardAuthorStatus = styled(Typography)(() => ({
  paddingTop: "3px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "inherit",
}));

export const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  "& .MuiAvatar-root": {
    width: 22,
    height: 22,
    fontSize: "10px",
  },
  "& .MuiAvatarGroup-avatar": {
    width: 22,
    height: 22,
    fontSize: "10px",
  },
}));
