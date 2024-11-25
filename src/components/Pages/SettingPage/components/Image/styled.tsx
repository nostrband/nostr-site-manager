import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { grey } from "@mui/material/colors";

export const StyledImgPreview = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 348,
  position: "relative",
  overflow: "hidden",
  marginTop: 20,
  borderRadius: theme.shape.borderRadius,
  background: grey[300],
  color: "#fff",
  fontSize: 70,
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
  [theme.breakpoints.down("sm")]: {
    height: 160,
  },
}));
