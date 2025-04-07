import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { InterDisplay } from "@/mui/theme";

export const StyledWrapImg = styled(Box)(({ theme }) => ({
  height: "320px",
  width: "100%",
  borderRadius: 32,
  overflow: "hidden",
  position: "relative",
  img: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
    position: "absolute",
    left: 0,
    top: 0,
  },
  marginTop: 80,
  [theme.breakpoints.down("md")]: {
    marginTop: 48,
    height: "240px",
  },
}));

export const StyledBenefitImgFooter = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "13px 28px",
  backdropFilter: "blur(7px)",
  [theme.breakpoints.down("md")]: {
    padding: "13px 20px",
  },
}));

export const StyledBenefitImgTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "18px",
  fontFamily: InterDisplay.style.fontFamily,
  fontWeight: "600",
  textTransform: "capitalize",
  marginBottom: 4,
}));

export const StyledBenefitImgSubTitle = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  opacity: 0.7,
}));
