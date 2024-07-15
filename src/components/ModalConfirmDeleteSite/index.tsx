"use client";
import {
  DialogTitle,
  Fab,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
  StyledActionButton,
} from "@/components/ModalConfirmDeleteSite/styled";
import { StyledFormControl, StyledInputAdornment } from "@/modules/auth/styled";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import { useFormik } from "formik";
import { validationSchemaConfirmDelete } from "@/validations/rules";
import { useRouter } from "next/navigation";

export const ModalConfirmDeleteSite = ({
  isOpen,
  siteId,
  handleClose,
}: {
  isOpen: boolean;
  siteId: string;
  handleClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const initialValues = {
    confirmText: "",
  };

  const {
    handleReset,
    values,
    isValid,
    dirty,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchemaConfirmDelete,
    onSubmit: async (values) => {
      setIsLoading(true);

      setTimeout(() => {
        alert("delete site");
        push("/admin");
        handleCancel();
      }, 1500);
    },
  });

  const handleCancel = () => {
    handleReset(undefined);
    handleClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Confirm for delete
          <Fab
            onClick={handleCancel}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>
      </DialogTitle>
      <StyledDialogContent>
        <Typography variant="body1" gutterBottom>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Please type "delete" to delete this site
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledFormControl
            fullWidth
            error={touched.confirmText && Boolean(errors.confirmText)}
          >
            <OutlinedInput
              name="confirmText"
              value={values.confirmText}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmText && Boolean(errors.confirmText)}
            />
            {touched.confirmText && errors.confirmText && (
              <FormHelperText>{errors.confirmText}</FormHelperText>
            )}
          </StyledFormControl>

          <StyledActionButton>
            <LoadingButton
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              color="error"
              variant="contained"
              type="submit"
              fullWidth
              size="large"
              loading={isLoading}
              disabled={!(isValid && dirty) || isLoading}
            >
              Delete
            </LoadingButton>
          </StyledActionButton>
        </form>
      </StyledDialogContent>
    </StyledDialog>
  );
};
