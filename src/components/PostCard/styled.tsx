"use client";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  CardMediaProps,
  Link,
  LinkProps,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { forwardRef } from "react";

const POST_CARD_PADDING = 16;
const CARD_MEDIA_HEIGHT = 160;

interface ICardMedia {
  alt?: string;
}

export type IStyledCardMedia = ICardMedia & CardMediaProps;

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[0],
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

export const StyledCardContent = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledCardNoImage = styled(Box)(({ theme }) => ({
  flex: `0 0 ${CARD_MEDIA_HEIGHT}px`,
  background: grey[300],
  display: "flex",
  height: CARD_MEDIA_HEIGHT,
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  fontSize: 60,
  color: "#fff",
}));

export const StyledCardMedia = styled(
  forwardRef<HTMLImageElement, IStyledCardMedia>(
    function StyledCardMediaName(props, ref) {
      return <CardMedia ref={ref} {...props} />;
    },
  ),
)(({ theme }) => ({
  flex: `0 0 ${CARD_MEDIA_HEIGHT}px`,
  height: CARD_MEDIA_HEIGHT,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledDate = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  textTransform: "uppercase",
  fontSize: "12px",
  lineHeight: "24px",
  width: "100%",
}));

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  textTransform: "uppercase",
  fontSize: "12px",
  lineHeight: "24px",
  width: "100%",
}));

export const StyledCardTitle = styled(Box)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  fontWeight: "700",
  fontSize: 16,
  lineHeight: "20px",
  color: theme.palette.primary.main,
}));

export const StyledCardDescription = styled(Typography)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  fontWeight: "500",
  fontSize: 12,
  lineHeight: "19px",
}));

export const StyledCardText = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  width: "100%",
}));

export const StyledCardWrapAuthor = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginTop: "auto",
}));

export const StyledAvatrAuthor = styled(Avatar)(() => ({
  width: 32,
  height: 32,
}));

export const StyledPostAuthorName = styled(Box)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 1,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  fontSize: "16px",
  lineHeight: "24px",
  fontWeight: "500",
}));

export const StyledLink = styled(
  forwardRef<HTMLLinkElement, LinkProps>(function MainContentName(props, ref) {
    return <Link component="nav" ref={ref} {...props} />;
  }),
)(() => ({
  height: "100%",
  textDecoration: "none",
  padding: POST_CARD_PADDING,
}));

export const StyledStatus = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginRight: "auto",
  fontSize: "13px",
  lineHeight: "20px",
  fontWeight: "700",
  color: theme.palette.success.main,
}));
