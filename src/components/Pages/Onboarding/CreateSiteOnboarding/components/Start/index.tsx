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
      <StyledTitlePage>Let&apos;s Build a Sample Website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Unleash Your Creativity with Our Easy-to-Use Website Builder!
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
          Sure
        </Button>
      </StyledActions>
    </>
  );
};
