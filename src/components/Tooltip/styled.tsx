"use client";
import { styled } from "@mui/material/styles";
import { Box, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

export const StyledActions = styled(Box)(() => ({
  display: "flex",
}));

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#000",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 147,
    fontSize: "10px",
    textAlign: "center",
    fontWeight: "400",
    background: "#000",
    marginTop: "14px !important",
    padding: "4px 8px !important",
  },
});
