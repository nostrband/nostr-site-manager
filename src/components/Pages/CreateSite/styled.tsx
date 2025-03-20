"use client";
import { styled } from "@mui/material/styles";
import { StyledWrapOnboardingChildren } from "@/components/shared/styled";
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

export const StyledSelectButtonText = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  lineHeight: "20px",
  fontWeight: "bold",
  marginBottom: 2,
  color: theme.palette.primary.main,
}));

export const StyledSelectButtonSubText = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: "20px",
  fontWeight: "400",
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
