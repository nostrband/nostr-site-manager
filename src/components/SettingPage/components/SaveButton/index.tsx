import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

interface ISaveButton {
  isEdit: boolean;
  isLoading: boolean;
  handleAction: () => void;
  text?: string;
}
export const SaveButton = ({
  isEdit,
  isLoading,
  handleAction,
  text = "Edit",
}: ISaveButton) => (
  <LoadingButton
    color="decorate"
    variant={isEdit ? "contained" : "outlined"}
    size="small"
    loading={isLoading}
    disabled={isLoading}
    onClick={handleAction}
  >
    {isEdit ? "Save" : text}
  </LoadingButton>
);
