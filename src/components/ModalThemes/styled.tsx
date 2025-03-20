import { styled } from "@mui/material/styles";
import { Typography, Dialog, DialogContent, Box } from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  marginBottom: 10,
}));

export const StyledDialogTitle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  padding: 24,
  paddingBottom: 5,
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "400px",
  padding: 0,
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
}));
