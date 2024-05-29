"use client";
import { styled } from "@mui/material/styles";
import {
  List,
  ListProps,
  Box,
  FormControl,
  FormControlProps,
} from "@mui/material";

export const StyledList = styled((props: ListProps) => {
  return <List {...props} />;
})({
  width: "100%",
  maxWidth: 360,
  margin: "auto",
});

export const StyledHeadSettingBlock = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",
  marginBottom: 16,
}));

export const StyledSettingBlock = styled(Box)(() => ({
  padding: 30,
  border: "1px solid #dfdfdf",
  borderRadius: "10px",
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
