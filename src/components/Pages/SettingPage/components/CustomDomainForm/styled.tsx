import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  DialogContent,
  FormControl,
  FormControlProps,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  width: "300px",
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
}));

export const StyledDialogContentTable = styled(DialogContent)(() => ({
  maxWidth: "700px",
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,
}));

export const StyledFormControl = styled((props: FormControlProps) => {
  return <FormControl {...props} />;
})({
  marginTop: 10,
});
