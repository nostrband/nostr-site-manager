import { styled } from "@mui/material/styles";
import { Typography, DialogContent, DialogTitle, Dialog } from "@mui/material";

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  maxWidth: 348,
  width: "100%",
  padding: 16,
  overflow: "visible",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  [theme.breakpoints.down("sm")]: {
    maxWidth: 300,
  },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  ".MuiDialog-paper": {
    width: "348px",
    [theme.breakpoints.down("sm")]: {
      maxWidth: 300,
      margin: 16,
    },
  },
}));

export const StyledNotifyWhenLoading = styled(Typography)(() => ({
  textAlign: "center",
}));
