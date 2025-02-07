import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledIcon = styled(Box)(({ theme }) => ({
  height: "auto",
  width: 235,
  margin: "auto",
  marginTop: 98,
  [theme.breakpoints.down("md")]: {
    marginTop: 16,
    width: 131,
  },
}));
