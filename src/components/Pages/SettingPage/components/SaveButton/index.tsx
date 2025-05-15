import { CheckIcon, EditIcon, InfoIcon } from "@/components/Icons";
import { userIsReadOnly } from "@/services/nostr/nostr";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button, ClickAwayListener } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { StyledActions } from "./styled";
import useResponsive from "@/hooks/useResponsive";
import { StyledTooltip } from "@/components/Tooltip/styled";

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
}: ISaveButton) => {
  const isDesktop = useResponsive("up", "sm");
  const [open, setOpen] = useState(false);
  const title = "This feature is only available to logged in users";

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <>
      {userIsReadOnly ? (
        <StyledActions>
          <LoadingButton
            variant="text"
            size="medium"
            disabled
            startIcon={startIcon ? startIcon : <EditIcon />}
          >
            {text}
          </LoadingButton>

          {isDesktop ? (
            <StyledTooltip placement="bottom-end" title={title} arrow>
              <Button color="info" variant="text" sx={{ minWidth: "auto" }}>
                <InfoIcon fontSize="small" />
              </Button>
            </StyledTooltip>
          ) : (
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <div>
                <StyledTooltip
                  onClose={handleTooltipClose}
                  open={open}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  slotProps={{
                    popper: {
                      disablePortal: true,
                    },
                  }}
                  placement="bottom-end"
                  title={title}
                  arrow
                >
                  <Button
                    onClick={handleTooltipOpen}
                    color="info"
                    variant="text"
                    sx={{ minWidth: "auto" }}
                  >
                    <InfoIcon fontSize="small" />
                  </Button>
                </StyledTooltip>
              </div>
            </ClickAwayListener>
          )}
        </StyledActions>
      ) : (
        <LoadingButton
          variant="text"
          size="medium"
          loading={isLoading}
          disabled={disabled || isLoading}
          onClick={handleAction}
          startIcon={
            isLoading ? undefined : isEdit ? (
              <CheckIcon />
            ) : startIcon ? (
              startIcon
            ) : (
              <EditIcon />
            )
          }
        >
          {isEdit ? "Save" : text}
        </LoadingButton>
      )}
    </>
  );
};
