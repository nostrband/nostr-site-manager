import { styled } from "@mui/material/styles";
import { Typography, Box, Dialog, DialogContent } from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledAuthor = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
}));

export const StyledActionContributor = styled(Box)(() => ({
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
