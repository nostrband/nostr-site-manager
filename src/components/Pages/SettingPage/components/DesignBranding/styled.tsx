import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const StyledText = styled(Typography)(() => ({
  fontSize: 14,
  b: {
    color: "#000",
    fontWeight: "700",
  },
}));
