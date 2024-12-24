import { styled } from "@mui/material/styles";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  width: "288px",
  padding: "16px !important",
  gap: 16,
  display: "flex",
  flexDirection: "column",
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 16,
  paddingBottom: 0,
}));

export const StyledTitle = styled(Typography)(() => ({
  fontSize: 20,
  lineHeight: "26px",
  fontWeight: "bold",
}));
