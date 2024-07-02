import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledLightBenefit = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: 40,
  padding: 48,
  height: "100%",
  [theme.breakpoints.down("md")]: {
    padding: 24,
  },
}));

export const StyledFullGrayBenefit = styled(Box)(({ theme }) => ({
  background: "#606677",
  borderRadius: 40,
  padding: 48,
  paddingBottom: 64,
  paddingTop: 128,
  [theme.breakpoints.down("md")]: {
    padding: 24,
    paddingBottom: 32,
    paddingTop: 32,
  },
}));

export const StyledFullLightGrayBenefit = styled(Box)(({ theme }) => ({
  background: "#727A8E",
  borderRadius: 40,
  padding: 96,
  display: "flex",
  alignItems: "center",
  gap: 128,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "start",
    padding: 24,
    gap: 48,
  },
}));

export const StyledOpenSourceEmblemWrap = styled(Box)(({ theme }) => ({
  height: 320,
  borderRadius: 40,
  maxWidth: 320,
  display: "flex",
  width: "100%",
  background: "linear-gradient(to top, #FF3ED9, #FFF)",
}));

export const StyledOpenSourceEmblem = styled(Box)(({ theme }) => ({
  height: "calc(100% - 8px)",
  width: "calc(100% - 8px)",
  borderRadius: 40,
  background: "#727A8E",
  margin: "auto",
  display: "flex",
  justifyContent: "end",
  alignItems: "end",
  padding: 15,
  flexDirection: "column",
}));

export const StyledOpenSourceTitle = styled(Typography)(({ theme }) => ({
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "700",
  fontSize: 137,
  lineHeight: "100px",
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    fontSize: 107,
  },
}));

export const StyledOpenSourceSubTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "600",
  fontSize: 20,
  maxWidth: 250,
  textAlign: "right",
  marginBottom: 10,
  color: "#fff",
  [theme.breakpoints.down("md")]: {
    fontSize: 16,
    maxWidth: 180,
  },
}));

export const StyledTitleBlock = styled(Typography)(({ theme }) => ({
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "700",
  fontSize: 32,
  lineHeight: "39px",
  color: theme.palette.secondary.main,
  span: {
    color: theme.palette.decorate.main,
  },
  [theme.breakpoints.down("md")]: {
    fontSize: 24,
    lineHeight: "29px",
  },
}));

export const StyledBottomInfo = styled(Box)(() => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "end",
}));

export const StyledTitleFullBlock = styled(Typography)(({ theme }) => ({
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "700",
  fontSize: 48,
  color: "#fff",
  marginBottom: 18,
  lineHeight: "59px",
  [theme.breakpoints.down("md")]: {
    marginBottom: 16,
    fontSize: 32,
    lineHeight: "39px",
  },
}));

export const StyledSubTitleFullBlock = styled(Typography)(() => ({
  fontWeight: "600",
  fontSize: 24,
  color: "#fff",
  lineHeight: "34px",
}));
