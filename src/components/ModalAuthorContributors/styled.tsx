import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTitleProps,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: "20px",
}));

export const StyledAuthorWrap = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
}));

export const StyledAuthorGroup = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: "16px",
}));

export const StyledDialogTitle = styled((props: DialogTitleProps) => {
  return <DialogTitle {...props} />;
})({
  padding: 16,
});

export const StyledAuthor = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
}));

export const StyledAuthorName = styled(Typography)(() => ({
  fontSize: "14px",
  fontWeight: "700",
  lineHeight: "18px",
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "348px",
  padding: 16,
  [theme.breakpoints.down("sm")]: {
    width: "300px",
  },
}));
