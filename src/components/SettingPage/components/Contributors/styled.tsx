"use client";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledAutorProfile = styled(Box)(() => ({
  display: "flex",
  gap: 10,
}));

export const StyledAutorProfileWrap = styled(Box)(() => ({
  alignItems: "center",
  ":not(:last-child)": {
    borderBottom: "1px solid #ececec",
  },
  paddingBottom: 20,
}));

export const StyledAutorProfileGroup = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 20,
}));
