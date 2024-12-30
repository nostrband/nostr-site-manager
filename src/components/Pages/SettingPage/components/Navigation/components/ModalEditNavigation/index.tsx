"use client";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogTitle,
  StyledTitle,
} from "./styled";
import useResponsive from "@/hooks/useResponsive";
import { CheckIcon, CrossIcon } from "@/components/Icons";
import { useFormik } from "formik";
import { validationSchemaEditNavigation } from "@/validations/rules";

interface IModalEditNavigation {
  id: string;
  title: string;
  link: string;
  isOpen: boolean;
  handleClose: (deleted: boolean) => void;
  handleChangeNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
    field: "title" | "link";
    value: string;
  }) => void;
}

export const ModalEditNavigation = ({
  isOpen,
  handleClose,
  handleChangeNavigation,
  id,
  title,
  link,
}: IModalEditNavigation) => {
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const handleCancel = () => {
    handleClose(false);
  };

  const { submitForm, handleChange, handleBlur, errors } = useFormik({
    initialValues: {
      title: "",
      link: "",
    },
    validationSchema: validationSchemaEditNavigation,
    onSubmit: async () => {
      handleClose(false);
    },
  });

  return (
    <StyledDialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle>
        <StyledTitle variant="body1">Add title & link</StyledTitle>

        <Button
          onClick={handleCancel}
          variant="text"
          color="secondary"
          sx={{ minWidth: "auto" }}
        >
          <CrossIcon color="inherit" />
        </Button>
      </StyledDialogTitle>

      <StyledDialogContent>
        <FormControl fullWidth size={sizeField} error={Boolean(errors.title)}>
          <InputLabel htmlFor="title">Title link</InputLabel>

          <OutlinedInput
            id="title"
            name="title"
            label="Title link"
            onChange={(e) => {
              handleChangeNavigation({
                id,
                field: "title",
                type: "primary",
                value: e.target.value,
              });

              handleChange(e);
            }}
            value={title}
            onBlur={handleBlur}
            error={!!errors.title}
          />
          {errors.title && (
            <Typography variant="body2" color="error">
              {errors.title}
            </Typography>
          )}
        </FormControl>

        <FormControl fullWidth size={sizeField} error={Boolean(errors.title)}>
          <InputLabel htmlFor="link">Link</InputLabel>

          <OutlinedInput
            id="link"
            name="link"
            label="Link"
            onChange={(e) => {
              handleChangeNavigation({
                id,
                field: "link",
                type: "primary",
                value: e.target.value,
              });

              handleChange(e);
            }}
            value={link}
            onBlur={handleBlur}
            error={!!errors.link}
          />

          {errors.link && (
            <Typography variant="body2" color="error">
              {errors.link}
            </Typography>
          )}
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          color="decorate"
          size="large"
          endIcon={<CheckIcon fontSize="inherit" />}
          onClick={submitForm}
        >
          Save
        </Button>
      </StyledDialogContent>
    </StyledDialog>
  );
};
