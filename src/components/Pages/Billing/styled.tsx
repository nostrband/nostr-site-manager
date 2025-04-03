"use client";
import { styled } from "@mui/material/styles";
import { StyledWrap } from "@/components/shared/styled";
import { Box, Typography } from "@mui/material";
import { forwardRef } from "react";
import { IStyledFeatureSubscription } from "@/components/shared/StatusSubscription/styled";

export const StyledWrapColumn = styled(StyledWrap)(() => ({
  maxWidth: 348,
}));

export const StyledFeatureSubscription = styled(
  forwardRef<HTMLDivElement, IStyledFeatureSubscription>(
    function FeatureSubscriptionName(props, ref) {
      const exclude = new Set(["icon"]);

      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return (
        <Typography color="primary" variant="body4" ref={ref} {...omitProps}>
          {props.icon && props.icon}
          <span>{props.children}</span>
        </Typography>
      );
    },
  ),
)(({ theme }) => ({
  display: "flex",
  gap: 8,
  color: theme.palette.secondary.main,
}));

export const StyledProgress = styled(Box)(() => ({
  display: "flex",
  gap: 8,
  flexDirection: "column",
}));

export const StyledSubscriptionHead = styled(Box)(() => ({
  display: "flex",
  gap: 8,
  justifyContent: "space-between",
  alignItems: "center",
}));
