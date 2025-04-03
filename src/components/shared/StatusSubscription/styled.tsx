"use client";
import { styled } from "@mui/material/styles";
import { Typography, TypographyProps } from "@mui/material";
import { forwardRef, ReactNode } from "react";

interface IFeatureSubscription {
  icon?: ReactNode;
}

export type IStyledFeatureSubscription = IFeatureSubscription & TypographyProps;

export const StyledStatusSubscription = styled(
  forwardRef<HTMLDivElement, IStyledFeatureSubscription>(
    function FeatureSubscriptionName(props, ref) {
      const exclude = new Set(["icon"]);

      const omitProps = Object.fromEntries(
        Object.entries(props).filter((e) => !exclude.has(e[0])),
      );

      return (
        <Typography component="div" variant="h7" ref={ref} {...omitProps}>
          {props.icon && props.icon}
          <span>{props.children}</span>
        </Typography>
      );
    },
  ),
)(() => ({
  display: "flex",
  gap: 8,
  alignItems: "center",
  fontSize: "18px",
  span: {
    fontSize: "13px",
  },
}));
