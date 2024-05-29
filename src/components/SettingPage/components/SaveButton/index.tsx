import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";

interface ISaveButton {
  isEdit: boolean;
  isLoading: boolean;
  handleAction: () => void;
}
export const SaveButton = ({
  isEdit,
  isLoading,
  handleAction,
}: ISaveButton) => (
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
);
