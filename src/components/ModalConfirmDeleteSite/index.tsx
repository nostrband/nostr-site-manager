"use client";
import { Button, FormHelperText, OutlinedInput } from "@mui/material";
import {
  StyledTitle,
  StyledDialog,
  StyledDialogContent,
  StyledActionButton,
  StyledFormControl,
  StyledDialogTitle,
  StyledText,
} from "@/components/ModalConfirmDeleteSite/styled";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useState } from "react";
import { useFormik } from "formik";
import { validationSchemaConfirmDelete } from "@/validations/rules";
import { deleteSite } from "@/services/nostr/api";
import { useSnackbar } from "notistack";
import { CrossIcon } from "../Icons";
import useResponsive from "@/hooks/useResponsive";

export const ModalConfirmDeleteSite = ({
  isOpen,
  siteId,
  handleClose,
}: {
  isOpen: boolean;
  siteId: string;
  handleClose: (deleted: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

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
    onSubmit: async () => {
      setIsLoading(true);
      try {
        await deleteSite(siteId);
        setIsLoading(false);
        handleClose(true);
      } catch (e: any) {
        setIsLoading(false);
        console.log("error", e);
        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      }
    },
  });

  const handleCancel = () => {
    handleReset(undefined);
    handleClose(false);
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Confirm for delete
          <Button
            onClick={handleCancel}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <CrossIcon color="inherit" />
          </Button>
        </StyledTitle>
      </StyledDialogTitle>
      <StyledDialogContent>
        <StyledText variant="body2">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Please type "delete" to delete this site
        </StyledText>
        <form onSubmit={handleSubmit}>
          <StyledFormControl
            fullWidth
            size={sizeField}
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
              color="decorate"
              variant="outlined"
              fullWidth
              size="large"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Cancel
            </LoadingButton>

            <LoadingButton
              color="decorate"
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
