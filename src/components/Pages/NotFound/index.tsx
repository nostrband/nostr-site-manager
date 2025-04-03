"use client";

import { Button } from "@mui/material";
import {
  StyledDescriptionPage,
  StyledTitlePage,
  StyledWrapPage,
} from "./styled";
import Link from "next/link";

export const NotFoundPage = () => {
  return (
    <StyledWrapPage>
      <StyledTitlePage>404 | This page could not be found.</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Click the button to return to the main page
      </StyledDescriptionPage>
      <Button LinkComponent={Link} href="/" size="large" variant="contained">
        Go to home
      </Button>
    </StyledWrapPage>
  );
};
