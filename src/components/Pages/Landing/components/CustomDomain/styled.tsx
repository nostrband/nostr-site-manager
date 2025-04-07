import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrapDomain = styled(Box)(({ theme }) => ({
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  gap: 16,
  borderRadius: "50px",
  padding: "12px 16px",
  background: theme.palette.primary.main,
  color: "#fff",
}));

export const StyledGroupDomain = styled(Box)(({ theme }) => ({
  maxWidth: 305,
  width: "100%",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  marginTop: 143,
  paddingBottom: 87,
  [theme.breakpoints.down("md")]: {
    marginTop: 48,
    paddingBottom: 0,
  },
}));

export const StyledWrapDomainDark = styled(Box)(() => ({
  maxWidth: "100%",
  display: "flex",
  alignItems: "center",
  gap: 16,
  borderRadius: "50px",
  padding: "12px 16px",
  background: "#E7E9F0",
  color: "#696F7D",
}));

export const StyledImgDomain = styled(Box)(() => ({
  width: "100%",
  maxWidth: 64,
  height: 64,
  flex: "0 0 64px",
  overflow: "hidden",
  borderRadius: "50%",
  img: {
    width: "inherit",
    height: "inherit",
    verticalAlign: "middle",
  },
}));

export const StyledTextDomain = styled(Typography)(({ theme }) => ({
  fontSize: 26,
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: 700,
  color: "#fff",
  [theme.breakpoints.down("sm")]: {
    fontSize: 18,
  },
}));

export const StyledTextDomainDark = styled(Typography)(({ theme }) => ({
  fontSize: 26,
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: 700,
  color: "#696F7D",
  [theme.breakpoints.down("sm")]: {
    fontSize: 18,
  },
}));
