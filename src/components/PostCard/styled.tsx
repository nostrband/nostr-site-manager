"use client";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  BoxProps,
  Card,
  CardMedia,
  CardMediaProps,
  Chip,
  Fab,
  Link,
  LinkProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { forwardRef } from "react";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { isNumber } from "lodash";

const POST_CARD_PADDING = 16;
const CARD_MEDIA_HEIGHT = 364;
const CARD_MEDIA_HEIGHT_SMALL = 160;

interface ICardMedia {
  alt?: string;
  isDesktop: boolean;
  height?: number;
  src?: string;
}

export type BoxType = ICardMedia & BoxProps;

interface ILoadingButton {
  isSending: boolean;
  isWaiting: boolean;
  isAdded: boolean;
}

export type LoadingButtonType = ILoadingButton & LoadingButtonProps;

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

export const StyledCardHead = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const StyledCardNoImage = styled(
  forwardRef<HTMLDivElement, BoxType>(function CardNoImageName(props, ref) {
    const exclude = new Set(["isDesktop"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isDesktop, theme }) => ({
  flex: `0 0 ${isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL}px`,
  height: isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL,
  background: grey[300],
  display: "flex",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  fontSize: 60,
  color: "#fff",
  position: "relative",
}));

export const StyledCardVideoWrap = styled(
  forwardRef<HTMLVideoElement, BoxType>(function CardVideoWrapName(props, ref) {
    const exclude = new Set(["isDesktop"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isDesktop, theme }) => ({
  flex: `0 0 ${isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL}px`,
  height: isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL,
  background: grey[300],
  display: "flex",
  width: "100%",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  position: "relative",
  "&::before": {
    content: '""',
    height: "100%",
    left: 0,
    objectFit: "cover",
    position: "absolute",
    top: 0,
    width: "100%",
    background: "#000",
    opacity: "0.2",
    zIndex: "1",
  },
}));

export const StyledCardVideoPlayButton = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.main,
  borderRadius: "50%",
  height: 56,
  width: 56,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  zIndex: "1",
  margin: "auto",
  color: "#fff",
}));

export const StyledCardVideo = styled("video")(() => ({
  bottom: 0,
  height: "100%",
  left: 0,
  objectFit: "cover",
  position: "absolute",
  right: 0,
  top: 0,
  width: "100%",
}));

export const StyledCardMediaWrap = styled(Box)(() => ({
  position: "relative",
}));

export const StyledCardMediaZoom = styled(Fab)(() => ({
  position: "absolute",
  right: 8,
  bottom: 8,
  zIndex: 2,
  fontSize: "18px",
  background: "#fff",
  height: "34px",
  width: "34px",
  minHeight: "34px",
}));

export const StyledCardMedia = styled(
  forwardRef<HTMLImageElement, IStyledCardMedia>(
    function CardMediaName(props, ref) {
      const exclude = new Set(["isDesktop", "height"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <CardMedia ref={ref} {...omitProps} />;
    },
  ),
)(({ isDesktop, theme, height }) => ({
  flex: `0 0 ${isDesktop ? (isNumber(height) ? height : CARD_MEDIA_HEIGHT) : CARD_MEDIA_HEIGHT_SMALL}px`,
  height: isDesktop
    ? isNumber(height)
      ? height
      : CARD_MEDIA_HEIGHT
    : CARD_MEDIA_HEIGHT_SMALL,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledDate = styled(Typography)<TypographyProps>(() => ({
  display: "flex",
  textTransform: "uppercase",
  fontSize: "12px",
  lineHeight: "24px",
  width: "100%",
  gap: 8,
}));

export const StyledTypePost = styled(Chip)(() => ({
  textTransform: "initial",
  background: "#8C07DD",
  marginLeft: "auto",
}));

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  textTransform: "uppercase",
  fontSize: "12px",
  lineHeight: "24px",
  width: "100%",
}));

export const StyledCardTitle = styled(Typography)(() => ({
  width: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  wordWrap: "break-word",
  fontWeight: "700",
  fontSize: 20,
  lineHeight: "26px",
}));

export const StyledCardDescription = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    wordWrap: "break-word",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: "25px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
      lineHeight: "22px",
    },
  }),
);

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

export const StyledTags = styled(Box)(() => ({
  display: "flex",
  gap: 10,
  width: "100%",
  flexWrap: "wrap",
}));

export const StyledAvatrAuthor = styled(Avatar)(() => ({
  width: 32,
  height: 32,
}));

export const StyledPostAuthorName = styled(Typography)(() => ({
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
  forwardRef<HTMLLinkElement, LinkProps>(function LinkName(props, ref) {
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

export const StyledAddButton = styled(
  forwardRef<HTMLButtonElement, LoadingButtonType>(
    function AddButtonName(props, ref) {
      const exclude = new Set(["isSending", "isWaiting", "isAdded"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <LoadingButton ref={ref} {...omitProps} />;
    },
  ),
)(({ isSending, isWaiting, isAdded }) => ({
  width: "88px",
  height: "32px",
  lineHeight: "32px",
  marginLeft: "auto",
  background: isSending
    ? "initial"
    : isWaiting
      ? "initial"
      : isAdded
        ? "rgba(255, 62, 217, 0.3)"
        : "initial",
}));

export const StyledAddButtonAvatar = styled(Avatar)(() => ({
  border: "1px solid #fff",
  height: "20px",
  width: "20px",
  fontSize: "12px !important",
}));
