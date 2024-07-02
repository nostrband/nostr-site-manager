import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledWrapImg = styled(Box)(() => ({
  img: {
    width: "100%",
    height: "auto",
    verticalAlign: "middle",
  },
}));

export const StyledWrap = styled(Box)(({ theme }) => ({
  background: "#464B58",
  borderRadius: 40,
  padding: 96,
  paddingTop: 128,
  [theme.breakpoints.down("md")]: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 0,
  },
  paddingBottom: 0,
}));
