import { EditIcon, GrabIcon, TrashIcon } from "@/components/Icons";
import {
  StyledActions,
  StyledButtonAction,
  StyledInfoNavigation,
  StyledLinkNavigation,
  StyledTitleNavigation,
} from "../../styled";
import { Box } from "@mui/material";
import { ModalEditNavigation } from "../ModalEditNavigation";
import { useEffect, useState } from "react";

interface IItemNavigation {
  id: string;
  title: string;
  link: string;
  isEdit: boolean;
  handleRemoveLinkNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
  }) => void;
  handleChangeNavigation: (input: {
    id: string;
    type: "primary" | "secondary";
    field: "title" | "link";
    value: string;
  }) => void;
}

export const ItemNavigation = ({
  handleChangeNavigation,
  handleRemoveLinkNavigation,
  id,
  title,
  link,
  isEdit,
}: IItemNavigation) => {
  const [isOpen, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);

    if (title.length === 0 && link.length === 0) {
      handleRemoveLinkNavigation({
        id,
        type: "primary",
      });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (title.length === 0 && link.length === 0) {
      setOpen(true);
    }
  }, [title, link]);

  return (
    <>
      <StyledInfoNavigation>
        {isEdit && <GrabIcon color="inherit" />}

        <Box sx={{ paddingLeft: "16px" }}>
          <StyledTitleNavigation>{title}</StyledTitleNavigation>

          <StyledLinkNavigation>{link}</StyledLinkNavigation>
        </Box>
      </StyledInfoNavigation>

      <StyledActions>
        <StyledButtonAction
          disabled={!isEdit}
          size="small"
          color="primary"
          variant="text"
          onClick={handleOpen}
        >
          <EditIcon fontSize="small" color="inherit" />
        </StyledButtonAction>

        <StyledButtonAction
          disabled={!isEdit}
          size="small"
          color="primary"
          variant="text"
          onClick={() =>
            handleRemoveLinkNavigation({
              id,
              type: "primary",
            })
          }
        >
          <TrashIcon fontSize="small" color="inherit" />
        </StyledButtonAction>
      </StyledActions>

      <ModalEditNavigation
        isOpen={isOpen}
        id={id}
        link={link}
        title={title}
        handleChangeNavigation={handleChangeNavigation}
        handleClose={handleClose}
      />
    </>
  );
};
