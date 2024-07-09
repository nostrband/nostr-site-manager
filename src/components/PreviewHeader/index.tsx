"use client";
import { StyledWrapper } from "@/components/PreviewHeader/styled";
import { Button } from "@mui/material";
import { ModalThemes } from "@/components/ModalThemes";
import React, { useState } from "react";
import { ExpandMoreTwoTone as ExpandMoreTwoToneIcon } from "@mui/icons-material";

export const PreviewHeader = ({
  themeName,
  themeId,
}: {
  themeName: string;
  themeId: string;
}) => {
  const [isOpenModalThemes, setOpenModalThemes] = useState(false);

  const handleClose = () => {
    setOpenModalThemes(false);
  };

  const handleOpen = () => {
    setOpenModalThemes(true);
  };

  return (
    <>
      <StyledWrapper>
        <Button
          sx={{ span: { paddingLeft: "4px" } }}
          color="primary"
          variant="outlined"
          onClick={handleOpen}
          endIcon={<ExpandMoreTwoToneIcon />}
        >
          Theme:
          <b>
            <span>{themeName}</span>
          </b>
        </Button>
      </StyledWrapper>
      <ModalThemes
        themeId={themeId}
        isOpen={isOpenModalThemes}
        handleClose={handleClose}
      />
    </>
  );
};
