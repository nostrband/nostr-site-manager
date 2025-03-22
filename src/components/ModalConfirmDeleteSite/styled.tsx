import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Dialog,
  DialogContent,
  FormControl,
  DialogTitle,
  DialogTitleProps,
  TypographyProps,
} from "@mui/material";

export const StyledTitle = styled(Typography)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const StyledText = styled(Typography)<TypographyProps>(() => ({
  marginBottom: 16,
}));

export const StyledActionButton = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
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

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
