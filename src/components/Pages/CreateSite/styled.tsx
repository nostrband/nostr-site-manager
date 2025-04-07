"use client";
import { styled } from "@mui/material/styles";
import {
  StyledWrapOnboardingChildren,
  StyledTitlePage,
} from "@/components/shared/styled";
import { Avatar, Box, Button, ButtonProps, Typography } from "@mui/material";
import { forwardRef } from "react";

interface ICollapseButton {
  isOpen?: boolean;
}

export type IICollapseButtonFilter = ICollapseButton & ButtonProps;

export const StyledWrapBuildingScreen = styled(StyledWrapOnboardingChildren)(
  () => ({
    marginTop: 40,
  }),
);

export const StyledWrapStartScreen = styled(StyledWrapOnboardingChildren)(
  () => ({
    gap: 24,
  }),
);

export const StyledSelectButton = styled(
  forwardRef<HTMLButtonElement, IICollapseButtonFilter>(
    function SelectButtonName(props, ref) {
      const exclude = new Set(["isOpen"]);
      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return <Button ref={ref} {...omitProps} />;
    },
  ),
)(({ isOpen }) => ({
  padding: 8,
  justifyContent: "space-between",
  textAlign: "left",
  ".MuiButton-endIcon": {
    transform: `${isOpen ? "rotate(90deg)" : "rotate(-90deg)"}`,
    transition: "0.3s",
  },
}));

export const StyledSelectButtonText = styled(Typography)(() => ({
  marginBottom: 2,
}));

export const StyledSelectButtonSubText = styled(Typography)(() => ({
  textWrap: "wrap",
}));

export const StyledMenuItemContent = styled(Box)(() => ({
  padding: "12px 8px",
  width: "100%",
}));

export const StyledAuthorAvatar = styled(Avatar)(() => ({
  height: "40px",
  width: "40px",
}));

export const StyledWrapAuthor = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "16px",
}));

export const StyledFormControl = styled(Box)(() => ({
  padding: "8px 16px",
}));

export const StyledTitleStartPage = styled(StyledTitlePage)(() => ({
  paddingBottom: 0,
}));

export const StyledWrapBlock = styled(Box)(({ theme }) => ({
  paddingBottom: 0,
  borderRadius: theme.shape.borderRadius,
  background: "#fff",
  padding: 16,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 16,
}));

export const StyledWrapChip = styled(Box)(() => ({
  padding: "0px 8px",
}));
