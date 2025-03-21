import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrap = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: 40,
  padding: "120px 96px",
  [theme.breakpoints.down("md")]: {
    padding: "40px 24px",
  },
}));

export const StyledGroupIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: 64,
  marginBottom: 64,
  [theme.breakpoints.down("lg")]: {
    gap: 44,
  },
  [theme.breakpoints.down("md")]: {
    gap: 16,
    marginBottom: 48,
  },
}));

export const StyledWrapIcon = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  background: theme.palette.primary.main,
  [theme.breakpoints.up("xs")]: {
    height: 56,
    width: 56,
    flex: "0 0 56px",
    padding: 15,
  },

  [theme.breakpoints.up("sm")]: {
    height: 96,
    width: 96,
    flex: "0 0 96px",
    padding: 22,
  },

  [theme.breakpoints.up("md")]: {
    height: 240,
    width: 240,
    flex: "0 0 240px",
    padding: 57,
  },
}));

export const StyledWrapIconDefault = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  background: "#606677",

  [theme.breakpoints.up("xs")]: {
    height: 56,
    width: 56,
    flex: "0 0 56px",
    padding: 15,
  },

  [theme.breakpoints.up("sm")]: {
    height: 96,
    width: 96,
    flex: "0 0 96px",
    padding: 22,
  },

  [theme.breakpoints.up("md")]: {
    height: 240,
    width: 240,
    flex: "0 0 240px",
    padding: 57,
  },
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "700",
  fontSize: 48,
  maxWidth: 908,
  margin: "auto",
  textAlign: "center",
  lineHeight: "59px",
  color: theme.palette.secondary.main,
  span: {
    color: theme.palette.primary.main,
  },
  [theme.breakpoints.down("md")]: {
    fontSize: 24,
    lineHeight: "39px",
  },
}));
