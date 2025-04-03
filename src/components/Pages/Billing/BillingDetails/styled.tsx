"use client";
import { styled } from "@mui/material/styles";
import { TabPanel } from "@mui/lab";
import { Box } from "@mui/material";
import { StyledCard } from "@/components/shared/styled";

export const StyledTabPanel = styled(TabPanel)(() => ({
  paddingLeft: 0,
  paddingRight: 0,
}));

export const StyledWrapColumn = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

export const StyledStikyWrap = styled(StyledCard)(() => ({
  position: "sticky",
  top: 55,
}));
