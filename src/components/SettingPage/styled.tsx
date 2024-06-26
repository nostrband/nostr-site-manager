"use client";
import { styled } from "@mui/material/styles";
import {
  List,
  ListProps,
  Box,
  FormControl,
  FormControlProps,
  Typography,
} from "@mui/material";

export const StyledList = styled((props: ListProps) => {
  return <List {...props} />;
})({
  width: "100%",
  maxWidth: 360,
  margin: "auto",
});

export const StyledHeadSettingBlock = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  marginBottom: 16,
  [theme.breakpoints.down("lg")]: {
    marginBottom: 8,
  },
}));

export const StyledSettingBlock = styled(Box)(({ theme }) => ({
  padding: 30,
  border: "1px solid #dfdfdf",
  borderRadius: "10px",
  [theme.breakpoints.down("lg")]: {
    padding: 10,
  },
}));

export const StyledSettingCol = styled(Box)(() => ({
  maxWidth: 500,
  paddingTop: 20,
}));

export const StyledFormControl = styled((props: FormControlProps) => {
  return <FormControl {...props} />;
})({
  marginTop: 30,
  maxWidth: 300,
});

export const StyledComingSoonProfile = styled(Box)(({ theme }) => ({
  display: "flex",
  height: 150,
  [theme.breakpoints.down("lg")]: {
    height: 90,
  },
  marginTop: 20,
  width: "100%",
  gap: 20,
  alignItems: "center",
  justifyContent: "center",
  color: "transparent",
  backgroundImage: "linear-gradient(to right, #00dbff, #373790)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  border: "2px solid transparent",
  borderImage: "linear-gradient(to right, #00dbff, #373790) 1",
  borderImageSlice: 1,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: "inherit",
    borderImage: "inherit",
  },
}));

export const StyledComingSoonTitle = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    fontSize: 30,
  },
}));
