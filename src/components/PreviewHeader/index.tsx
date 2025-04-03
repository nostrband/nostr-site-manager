"use client";
import {
  StyledEndIcon,
  StyledWrapper,
} from "@/components/PreviewHeader/styled";
import { Button } from "@mui/material";
import { ModalThemes } from "@/components/ModalThemes";
import React, { useState } from "react";

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
          variant="outlined"
          onClick={handleOpen}
          endIcon={<StyledEndIcon />}
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
