"use client";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

export const StyledSieBarContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

export const StyledSieBarButton = styled(Button)(({ theme }) => ({
  justifyContent: "flex-start",
  textTransform: "inherit",
  ".MuiButton-endIcon": {
    marginLeft: "auto",
  },
  "&&&": {
    "&.Mui-disabled": {
      color: theme.palette.textColor.dark,
      background: theme.palette.primary.main,
    },
  },
}));

export const StyledSideBarBottom = styled(Box)(() => ({
  marginTop: "auto",
  padding: "32px 16px",
  display: "flex",
  width: "100%",
  justifyContent: "space-between",
}));

export const StyledSieBarElements = styled(Box)(() => ({
  padding: "32px 16px",
}));
