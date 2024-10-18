import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const StyledImgPreview = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 250,
  position: "relative",
  overflow: "hidden",
  marginTop: 20,
  borderRadius: theme.shape.borderRadius,
  background: "#ececec",
  display: "flex",
  img: {
    bottom: 0,
    height: "100%",
    left: 0,
    objectFit: "cover",
    position: "absolute",
    right: 0,
    top: 0,
    width: "100%",
  },
}));
