import { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack";
import { Alert } from "@mui/material";

export const Notification = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, ...props }, ref) => {
    const { closeSnackbar } = useSnackbar();

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    const severity = props.variant === "default" ? "info" : props.variant;

    return (
      <SnackbarContent ref={ref}>
        <Alert
          sx={{ width: "100%" }}
          severity={severity}
          onClose={handleDismiss}
        >
          {props.message}
        </Alert>
      </SnackbarContent>
    );
  },
);

Notification.displayName = "Notification";
