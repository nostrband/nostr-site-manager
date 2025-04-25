import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

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

export const StyledBadgeTitle = styled(Box)(({ theme }) => ({
  order: "1",
  [theme.breakpoints.down("sm")]: {
    order: "0",
    width: "100%",
  },
}));
