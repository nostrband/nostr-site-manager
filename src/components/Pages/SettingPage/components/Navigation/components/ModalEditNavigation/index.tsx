"use client";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { StyledDialog, StyledDialogContent, StyledDialogTitle } from "./styled";
import useResponsive from "@/hooks/useResponsive";
import { CheckIcon, CrossIcon } from "@/components/Icons";
import { useFormik } from "formik";
import { validationSchemaEditNavigation } from "@/validations/rules";
import { useRef } from "react";
import { InputNavigation, InputNavigationReset } from "@/types/setting.types";

interface IModalEditNavigation {
  id: string;
  title: string;
  link: string;
  isOpen: boolean;
  handleClose: (deleted: boolean) => void;
  handleChangeNavigation: (input: InputNavigation) => void;
  handleResetNavigation: (input: InputNavigationReset) => void;
}

export const ModalEditNavigation = ({
  isOpen,
  handleClose,
  handleChangeNavigation,
  handleResetNavigation,
  id,
  title,
  link,
}: IModalEditNavigation) => {
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const resetValues = useRef({ title, link });

  const { values, submitForm, handleChange, handleBlur, errors, setValues } =
    useFormik({
      initialValues: {
        title,
        link,
      },
      validationSchema: validationSchemaEditNavigation,
      onSubmit: async () => {
        handleClose(false);

        resetValues.current = { ...values };
      },
    });

  const handleCancel = () => {
    if (
      resetValues.current.link.length === 0 &&
      resetValues.current.title.length === 0
    ) {
      handleClose(true);

      return;
    }

    handleClose(false);

    setValues({
      title: resetValues.current.title,
      link: resetValues.current.link,
    });

    handleResetNavigation({
      id,
      type: "primary",
      fields: {
        title: resetValues.current.title,
        link: resetValues.current.link,
      },
    });
  };

  return (
    <StyledDialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle>
        <Typography variant="h5">Add title & link</Typography>

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

        <FormControl fullWidth size={sizeField} error={Boolean(errors.link)}>
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
