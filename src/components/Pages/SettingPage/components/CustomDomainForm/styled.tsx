import { styled } from "@mui/material/styles";
import { Typography, DialogContent, DialogTitle, Dialog } from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  fontSize: 20,
  lineHeight: "26px",
  fontWeight: "bold",
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "348px",
  padding: 16,
  overflow: "visible",
  display: "flex",
  flexDirection: "column",
  gap: 16,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
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
  fontSize: 12,
  textAlign: "center",
  lineHeight: "12px",
}));

export const StyledDialogSubTitle = styled(Typography)(() => ({
  fontSize: 16,
  lineHeight: "20px",
  fontWeight: "bold",
}));

export const StyledDialogSubDescription = styled(Typography)(() => ({
  fontSize: 14,
  lineHeight: "22px",
}));
