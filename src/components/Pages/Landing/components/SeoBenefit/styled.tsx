import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledIcon = styled(Box)(({ theme }) => ({
  height: "auto",
  width: 126,
  marginBottom: 80,
  [theme.breakpoints.down("md")]: {
    marginBottom: 48,
    width: 94,
  },
}));
