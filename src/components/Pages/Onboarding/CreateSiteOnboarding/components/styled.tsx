import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledBuildingProgress = styled(Box)(() => ({
  position: "relative",
  display: "inline-flex",
}));

export const StyledBuildingProgressText = styled(Box)(() => ({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
