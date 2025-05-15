import { styled } from "@mui/material/styles";
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTitleProps,
  TypographyProps,
  Box,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const StyledText = styled(Typography)<TypographyProps>(() => ({
  marginBottom: 16,
}));

export const StyledDialogTitle = styled((props: DialogTitleProps) => {
  return <DialogTitle {...props} />;
})({
  padding: 16,
});

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

export const StyledList = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  marginBottom: 16,
}));

export const StyledEmptyWrap = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 16,
  textAlign: "center",
  alignItems: "center",
}));

export const StyledListItem = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
}));
