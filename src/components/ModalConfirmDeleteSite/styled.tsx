import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  FormControl,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledActionButton = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "400px",
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
