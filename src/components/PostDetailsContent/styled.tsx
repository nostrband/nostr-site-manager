"use client";
import { styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  BoxProps,
  Card,
  CardMedia,
  CardMediaProps,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { forwardRef } from "react";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { PageTitle } from "@/components/shared/styled";

const POST_CARD_PADDING = 16;
const CARD_MEDIA_HEIGHT = 363;
const CARD_MEDIA_HEIGHT_SMALL = 160;

interface ICardMedia {
  alt?: string;
  isDesktop: boolean;
}

interface ILoadingButton {
  isSending: boolean;
  isWaiting: boolean;
  isAdded: boolean;
}

export type LoadingButtonType = ILoadingButton & LoadingButtonProps;

export type IStyledCardMedia = ICardMedia & CardMediaProps;

export type BoxType = ICardMedia & BoxProps;

export const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxShadow: theme.shadows[0],
  gap: POST_CARD_PADDING,
  padding: POST_CARD_PADDING,
}));

export const StyledCardNoImage = styled(
  forwardRef<HTMLDivElement, BoxType>(function MainContentName(props, ref) {
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
}));

export const StyledCardMedia = styled(
  forwardRef<HTMLImageElement, IStyledCardMedia>(
    function MainContentName(props, ref) {
      const exclude = new Set(["isDesktop"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <CardMedia ref={ref} {...omitProps} />;
    },
  ),
)(({ isDesktop, theme }) => ({
  flex: `0 0 ${isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL}px`,
  height: isDesktop ? CARD_MEDIA_HEIGHT : CARD_MEDIA_HEIGHT_SMALL,
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
  wordWrap: "break-word",
  fontWeight: "700",
  fontSize: 20,
  lineHeight: "26px",
  color: theme.palette.primary.main,
}));

export const StyledCardTitleFeature = styled(Box)(({ theme }) => ({
  width: "100%",
  fontWeight: "700",
  fontSize: 20,
  lineHeight: "26px",
  color: theme.palette.primary.main,
}));

export const StyledCardDescription = styled(Typography)(({ theme }) => ({
  width: "100%",
  fontWeight: "500",
  fontSize: 16,
  lineHeight: "25px",
  wordWrap: "break-word",
  position: "relative",
  p: {
    margin: 0,
  },
  img: {
    width: "100%",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
    lineHeight: "22px",
  },
}));

export const StyledButtonCollapse = styled(Box)(() => ({
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  width: "100%",
  height: 100,
  padding: 8,
  display: "flex",
  alignItems: "end",
  justifyContent: "center",
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 80%)",
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

export const StyledStatus = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: "13px",
  lineHeight: "20px",
  fontWeight: "700",
  color: theme.palette.success.main,
}));

export const StyledStatusState = styled(Typography)(() => ({
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "700",
}));

export const StyledStatusWrap = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const StyledAddButton = styled(
  forwardRef<HTMLButtonElement, LoadingButtonType>(
    function MainContentName(props, ref) {
      const exclude = new Set(["isSending", "isWaiting", "isAdded"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <LoadingButton ref={ref} {...omitProps} />;
    },
  ),
)(({ isSending, isWaiting, isAdded }) => ({
  background: isSending
    ? "initial"
    : isWaiting
      ? "initial"
      : isAdded
        ? "rgba(255, 62, 217, 0.5)"
        : "initial",
}));

export const StyledTitlePage = styled(PageTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingBottom: 24,
  gap: 8,
  paddingTop: 40,
  span: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    wordWrap: "break-word",
  },
  [theme.breakpoints.down("sm")]: {
    paddingTop: 16,
  },
}));

export const StyledWrap = styled(Box)(() => ({
  maxWidth: 720,
  margin: "0 auto",
}));

export const StyledComingSoon = styled(Box)(() => ({
  fontWeight: "600",
  fontSize: 14,
  color: grey[400],
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
}));
