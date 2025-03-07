import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledWrapImg = styled(Box)(({ theme }) => ({
  img: {
    width: "100%",
    height: "auto",
    verticalAlign: "middle",
  },
}));
