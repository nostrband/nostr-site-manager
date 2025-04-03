import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

const scroll = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
`;

export const TextAnimation = styled(Typography)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "16px",
}));

export const GradientTop = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  height: "35px",
  zIndex: 1,
  top: 0,
  background:
    "linear-gradient(to bottom, rgba(245, 245, 245, 1), rgba(245, 245, 245, 0))",
}));

export const WrapBuildLoader = styled(Box)(() => ({
  position: "relative",
  overflow: "hidden",
  height: "200px",
  width: "100%",
}));

export const WrapBuildLoaderAnimation = styled(Box)(() => ({
  animation: `${scroll} 15s linear infinite`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "start",
}));

export const GradientBottom = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  height: "35px",
  zIndex: 1,
  bottom: 0,
  background:
    "linear-gradient(to top, rgba(245, 245, 245, 1), rgba(245, 245, 245, 0))",
}));
