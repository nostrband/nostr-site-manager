"use client";
import { styled } from "@mui/material/styles";
import {
  List,
  ListProps,
  Box,
  Typography,
  TypographyProps,
  Avatar,
} from "@mui/material";
import { PageTitle } from "@/components/shared/styled";
import { grey } from "@mui/material/colors";

export const StyledList = styled((props: ListProps) => {
  return <List {...props} />;
})({
  width: "100%",
  maxWidth: 360,
  margin: "auto",
});

export const StyledHeadSettingBlock = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginBottom: 16,
}));

export const StyledTitleBlock = styled((props: TypographyProps) => {
  return <Typography variant="h6" {...props} />;
})({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const StyledDescriptionBlock = styled((props: TypographyProps) => {
  return <Typography variant="body5" {...props} />;
})();

export const StyledSettingBlock = styled(Box)(({ theme }) => ({
  padding: 16,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  color: "rgba(0, 0, 0, 0.6)",
}));

export const StyledFormFields = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledComingSoonProfile = styled(Typography)(() => ({
  color: grey[400],
  height: 38,
  textAlign: "center",
}));

export const StyledTitleSection = styled(PageTitle)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    fontSize: "20px",
    lineHeight: "26px",
  },

  [theme.breakpoints.up("sm")]: {
    fontSize: "24px",
    lineHeight: "31px",
  },
}));

export const StyledWrap = styled(Box)(() => ({
  maxWidth: 720,
  margin: "0 auto",
  paddingBottom: 90,
}));

export const StyledWrapSettings = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 24,
}));

export const StyledWrapSectionSettings = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledIconImage = styled(Avatar)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontSize: 24,
  background: grey[300],
  height: 56,
  width: 56,
  aspectRatio: " 1 / 1",
  [theme.breakpoints.down("sm")]: {
    height: 42,
    width: 42,
  },
}));

export const SearchSettingsFieldWrap = styled(Box)(() => ({
  paddingBottom: "24px",
}));

export const StyledFieldIconImage = styled(Box)(() => ({
  display: "flex",
  gap: 16,
}));
