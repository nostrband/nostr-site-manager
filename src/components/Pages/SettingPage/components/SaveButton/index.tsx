import { CheckIcon, EditIcon } from "@/components/Icons";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { ReactNode } from "react";

interface ISaveButton {
  isEdit: boolean;
  isLoading: boolean;
  handleAction: () => void;
  text?: string;
  startIcon?: ReactNode;
  disabled?: boolean;
}
export const SaveButton = ({
  isEdit,
  isLoading,
  handleAction,
  disabled,
  text = "Edit",
  startIcon,
}: ISaveButton) => (
  <LoadingButton
    color="decorate"
    variant="text"
    size="medium"
    loading={isLoading}
    disabled={disabled || isLoading}
    onClick={handleAction}
    startIcon={isEdit ? <CheckIcon /> : startIcon ? startIcon : <EditIcon />}
  >
    {isEdit ? "Save" : text}
  </LoadingButton>
);
