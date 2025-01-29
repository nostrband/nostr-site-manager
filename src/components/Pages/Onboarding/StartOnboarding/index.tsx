import { Button } from "@mui/material";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../styled";
import Link from "next/link";

export const StartOnboarding = () => {
  return (
    <>
      <StyledTitlePage>Are you from Nostr?</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Have you ever published any content in the Nostr apps?
      </StyledDescriptionPage>
      <StyledActions>
        <Button
          LinkComponent={Link}
          href="/onboarding/connection?method=signup"
          fullWidth
          size="large"
          color="decorate"
          variant="outlined"
        >
          No
        </Button>
        <Button
          LinkComponent={Link}
          href="/onboarding/connection?method=login"
          fullWidth
          size="large"
          color="decorate"
          variant="contained"
        >
          Yes
        </Button>
      </StyledActions>
    </>
  );
};
