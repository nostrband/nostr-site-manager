import { styled } from "@mui/material/styles";
import { Dialog, DialogContent } from "@mui/material";

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  width: "288px",
  padding: 16,
  gap: 16,
  display: "flex",
  flexDirection: "column",
}));
