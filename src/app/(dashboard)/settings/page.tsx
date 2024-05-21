"use client";
import React, { useState } from "react";
import {
  Typography,
  Box,
  InputLabel,
  OutlinedInput,
  FormControl,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleAction = () => {
    if (isEdit) {
      setIsLoading(true);
      setIsEdit(false);

      setTimeout(() => {
        setIsLoading(false);

        enqueueSnackbar("Edit data success!", {
          autoHideDuration: 3000,
          variant: "success",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      }, 1500);
    } else {
      setIsEdit(true);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        General settings
      </Typography>

      <Box sx={{ maxWidth: 500 }}>
        <Box sx={{ p: 3, border: "1px solid #dfdfdf", borderRadius: "10px" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 1,
            }}
          >
            <Typography variant="h6">Title & Description</Typography>
            <LoadingButton
              color="info"
              variant="outlined"
              size="small"
              loading={isLoading}
              disabled={isLoading}
              onClick={handleAction}
            >
              {!isEdit ? "Edit" : "Save"}
            </LoadingButton>
          </Box>

          <Typography variant="body2" sx={{ mb: 3 }}>
            The details used to identify your publication around the web
          </Typography>

          <FormControl
            disabled={!isEdit}
            fullWidth
            size="small"
            sx={{ mb: 3, maxWidth: 300 }}
          >
            <InputLabel htmlFor="title">Title</InputLabel>
            <OutlinedInput id="title" name="title" label="Title" />
          </FormControl>

          <FormControl
            disabled={!isEdit}
            fullWidth
            size="small"
            sx={{ maxWidth: 300 }}
          >
            <InputLabel htmlFor="description">Description</InputLabel>
            <OutlinedInput
              id="description"
              name="description"
              label="Description"
            />
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
