import { Button } from "@mui/material";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import Link from "next/link";

export const Start = () => {
  return (
    <>
      <StyledTitlePage>Let&apos;s Make a Sample Site?</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Learn by doing, you can start right now and improve the website later.
      </StyledDescriptionPage>
      <StyledActions>
        <Button
          LinkComponent={Link}
          href="/admin"
          fullWidth
          size="large"
          color="decorate"
          variant="outlined"
        >
          Skip
        </Button>
        <Button
          LinkComponent={Link}
          href="/onboarding/create-site?step=building"
          fullWidth
          size="large"
          color="decorate"
          variant="contained"
        >
          Create a site
        </Button>
      </StyledActions>
    </>
  );
};
