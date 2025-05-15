import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrap = styled(Box)(({ theme }) => ({
  background: "#464B58",
  borderRadius: 40,
  paddingTop: 120,
  paddingBottom: 120,
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "700",
  fontSize: 48,
  color: "#C1C5CD",
  margin: "auto",
  marginBottom: 64,
  lineHeight: "59px",
  textAlign: "center",
  maxWidth: 908,
  [theme.breakpoints.down("md")]: {
    marginBottom: 48,
    fontSize: 32,
    lineHeight: "39px",
  },
  ".light-text": {
    color: "#fff",
  },
  ".decorate-text": {
    color: theme.palette.primary.main,
  },
}));

export const StyledGroupImg = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: 30,
  flexWrap: "nowrap",
  width: "100%",
  justifyContent: "center",
  img: {
    height: "auto",
    width: 428,
    verticalAlign: "middle",
    flex: "0 0 428px",
    borderRadius: 16,
    boxShadow: "0px 28px 40.1px 0px #00000026",
  },
  [theme.breakpoints.down("md")]: {
    img: {
      width: 214,
      flex: "0 0 214px",
    },
  },
}));
