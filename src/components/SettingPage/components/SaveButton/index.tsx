import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

interface ISaveButton {
  isEdit: boolean;
  isLoading: boolean;
  handleAction: () => void;
  text?: string;
  disabled?: boolean;
}
export const SaveButton = ({
  isEdit,
  isLoading,
  handleAction,
  disabled,
  text = "Edit",
}: ISaveButton) => (
  <LoadingButton
    color="decorate"
    variant={isEdit ? "contained" : "outlined"}
    size="small"
    loading={isLoading}
    disabled={disabled || isLoading}
    onClick={handleAction}
  >
    {isEdit ? "Save" : text}
  </LoadingButton>
);
