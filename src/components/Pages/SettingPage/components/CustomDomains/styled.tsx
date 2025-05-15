import { styled } from "@mui/material/styles";
import { Box, BoxProps } from "@mui/material";
import { forwardRef } from "react";
import { StyledTitleBlock } from "../../styled";

interface StyledBadgeTitleProps {
  isProPlan?: boolean;
}

export type BoxType = StyledBadgeTitleProps & BoxProps;

export const StyledTitleHead = styled(StyledTitleBlock)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
  },
}));

export const StyledTextTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
  span: {
    order: "0",
    [theme.breakpoints.down("sm")]: {
      order: "1",
    },
  },
}));

export const StyledBadgeTitle = styled(
  forwardRef<HTMLDivElement, BoxType>(function CardNoImageName(props, ref) {
    const exclude = new Set(["isProPlan"]);
    const omitProps = Object.fromEntries(
      Object.entries(props).filter((e) => !exclude.has(e[0])),
    );

    return <Box ref={ref} {...omitProps} />;
  }),
)(({ isProPlan, theme }) => ({
  order: "1",
  cursor: isProPlan ? "pointer" : "default",
  [theme.breakpoints.down("sm")]: {
    order: "0",
    width: "100%",
  },
}));
