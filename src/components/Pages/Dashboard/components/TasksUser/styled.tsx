"use client";
import { styled } from "@mui/material/styles";
import { Box, Divider, Typography } from "@mui/material";
import { TabPanel } from "@mui/lab";

export const StyledWrap = styled(Box)(() => ({
  display: "flex",
  paddingTop: 16,
  flexDirection: "column",
  gap: 16,
}));

export const StyledDivider = styled(Divider)(() => ({
  margin: "8px 0",
}));

export const StyledTitle = styled(Typography)(() => ({
  fontSize: 20,
  lineHeight: "26px",
  textAlign: "center",
  fontWeight: "700",
}));

export const StyledDescription = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: "22px",
  textAlign: "center",
}));

export const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,
  "> *:not(:last-child)": {
    marginBottom: 16,
  },
}));

export const StyledTabs = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));
