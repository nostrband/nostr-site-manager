import { styled } from "@mui/material/styles";
import {
  Typography,
  Dialog,
  DialogContent,
  List,
  DialogTitleProps,
  DialogTitle,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "20px",
  lineHeight: "26px",
}));

export const StyledDescription = styled(Typography)(() => ({
  fontSize: "14px",
  lineHeight: "22px",
}));

export const StyledDescriptionBottom = styled(Typography)(() => ({
  fontSize: "12px",
  lineHeight: "12px",
  textAlign: "center",
}));

export const StyledDialogTitle = styled((props: DialogTitleProps) => {
  return <DialogTitle {...props} />;
})({
  padding: 16,
});

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: "348px",
  padding: 16,
  paddingTop: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiPaper-root": {
    overflow: "visible",
  },
}));

export const StyledList = styled(List)(() => ({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));
