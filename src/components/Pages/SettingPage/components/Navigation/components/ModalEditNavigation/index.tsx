"use client";
import { Button, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { StyledDialog, StyledDialogContent } from "./styled";
import useResponsive from "@/hooks/useResponsive";
import { CheckIcon } from "@/components/Icons";

interface IModalEditNavigation {
  id: string;
  title: string;
  link: string;
  isOpen: boolean;
  handleClose: (deleted: boolean) => void;
  handleChangeNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
    field: "title" | "link";
    value: string;
  }) => void;
}

export const ModalEditNavigation = ({
  isOpen,
  handleClose,
  handleChangeNavigation,
  id,
  title,
  link,
}: IModalEditNavigation) => {
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const handleCancel = () => {
    handleClose(false);
  };

  return (
    <StyledDialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogContent>
        <FormControl fullWidth size={sizeField}>
          <InputLabel htmlFor="title">Title link</InputLabel>

          <OutlinedInput
            id="title"
            name="title"
            label="Title link"
            onChange={(e) =>
              handleChangeNavigation({
                id,
                field: "title",
                type: "primary",
                value: e.target.value,
              })
            }
            value={title}
          />
        </FormControl>

        <FormControl fullWidth size={sizeField}>
          <InputLabel htmlFor="link">Link</InputLabel>

          <OutlinedInput
            id="link"
            name="link"
            label="Link"
            onChange={(e) =>
              handleChangeNavigation({
                id,
                field: "link",
                type: "primary",
                value: e.target.value,
              })
            }
            value={link}
          />
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          color="decorate"
          size="large"
          endIcon={<CheckIcon fontSize="inherit" />}
          onClick={handleCancel}
        >
          Save
        </Button>
      </StyledDialogContent>
    </StyledDialog>
  );
};
