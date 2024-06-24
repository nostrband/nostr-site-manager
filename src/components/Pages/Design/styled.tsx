"use client";
import { styled } from "@mui/material/styles";
import { Box, Fab, InputLabel, TextField, Typography } from "@mui/material";

export const StyledBottomActions = styled(Box)(() => ({
  position: "sticky",
  bottom: 0,
  left: 0,
  width: "100%",
  display: "flex",
  padding: "8px",
  gap: "8px",
  borderTop: "1px solid #EAEAEA",
  background: "#fff",
  zIndex: 5,
}));

export const StyledButtonOpenSetting = styled(Fab)(() => ({
  position: "fixed",
  zIndex: 5,
  bottom: "25px",
  right: "25px",
}));

export const StyledWrapper = styled(Box)(() => ({
  width: 320,
  padding: "15px",
}));

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
  marginBottom: "20px",
}));

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
}));

export const StyledFormControl = styled(Box)(() => ({
  gap: 5,
  display: "flex",
  flexDirection: "column",
  marginBottom: 15,
}));

export const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#f3f3f3",
    "& fieldset": {
      border: "none",
    },
  },
}));

export const StyledImgPreview = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  background: "#ececec",
  padding: 10,
  display: "flex",
  img: {
    height: "auto",
    width: "100%",
    verticalAlign: "middle",
    margin: "auto",
  },
}));

export const StyledBannerPreview = styled(Box)(({ theme }) => ({
  width: "100%",
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  background: "#ececec",
  padding: 10,
  display: "flex",
  img: {
    height: "auto",
    width: "100%",
    verticalAlign: "middle",
    margin: "auto",
  },
}));

export const StyledItemNavigation = styled(Box)({
  display: "flex",
  gap: 20,
  marginBottom: 20,
  paddingBottom: 20,
  flexDirection: "column",
  borderBottom: "1px solid #ececec",
});

export const StyledPreviewTestSite = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
}));
