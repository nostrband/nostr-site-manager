"use client";
import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_PLAN_COLOR } from "@/consts";

interface IBadge {
  subscriptionPlan: SUBSCRIPTION_PLAN;
}

export type IStyledBadge = IBadge & BoxProps;

export const StyledBadge = styled(
  forwardRef<HTMLDivElement, IStyledBadge>(function BadgeName(props, ref) {
    const exclude = new Set(["subscriptionPlan"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ subscriptionPlan, theme }) => ({
  background: theme.palette[SUBSCRIPTION_PLAN_COLOR[subscriptionPlan]].main,
  fontSize: 10,
  lineHeight: "14px",
  color: "#fff",
  borderRadius: theme.shape.borderRadius / 2,
  padding: "2px 4px",
}));
