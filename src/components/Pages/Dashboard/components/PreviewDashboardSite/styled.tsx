"use client";
import { styled } from "@mui/material/styles";
import { CardActionArea, Typography } from "@mui/material";
import { CARD_MEDIA_HEIGHT } from "@/components/PreviewSite/styled";
import { grey } from "@mui/material/colors";

export const StyledCardAddImage = styled(CardActionArea)(({ theme }) => ({
  flex: `0 0 ${CARD_MEDIA_HEIGHT}px`,
  background: grey[300],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  height: CARD_MEDIA_HEIGHT,
  width: "100%",
  borderRadius: 0,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
  fontSize: 78,
  color: "#fff",
}));

export const StyledTextAddImage = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: "22px",
  fontWeight: "400",
  color: grey[500],
}));
