import { styled } from "@mui/material/styles";
import { Typography, Dialog, DialogContent } from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "600px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));
