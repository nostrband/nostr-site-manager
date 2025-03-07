"use client";
import { styled } from "@mui/material/styles";
import { Box, Divider, Typography } from "@mui/material";
import { TabPanel, TabPanelProps } from "@mui/lab";
import { forwardRef } from "react";

interface ITabPanel {
  isGutter: boolean;
  isMoreThanLimit: boolean;
}

export type TabPanelType = ITabPanel & TabPanelProps;

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

export const StyledTabPanel = styled(
  forwardRef<HTMLElement, TabPanelType>(
    function StyledTabPanelName(props, ref) {
      const exclude = new Set(["isGutter, isMoreThanLimit"]);

      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <TabPanel value={props.value} ref={ref} {...omitProps} />;
    },
  ),
)(({ isGutter, isMoreThanLimit, theme }) => ({
  padding: 0,
  overflow: isMoreThanLimit ? "hidden" : "initial",
  overflowY: "auto",
  height: isMoreThanLimit ? 230 : "auto",
  "> *:not(:last-child)": {
    marginBottom: 16,
  },

  [theme.breakpoints.up("sm")]: {
    paddingRight: isGutter && isMoreThanLimit ? 4 : 0,
  },
}));

export const StyledTabs = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledEmptyTasks = styled(Typography)(() => ({
  fontSize: 14,
  textAlign: "center",
  fontWeight: "400",
}));
