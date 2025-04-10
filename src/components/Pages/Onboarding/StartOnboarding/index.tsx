import { Button } from "@mui/material";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../styled";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/services/nostr/nostr";
import { useContext, useEffect } from "react";

export const StartOnboarding = () => {
  const router = useRouter();
  const { isAuth, isLoading } = useContext(AuthContext);

  // redirect to final step if we're already in
  useEffect(() => {
    if (isAuth) router.push("/onboarding/create-site");
  }, [isAuth, isLoading]);

  if (isLoading) return;

  return (
    <>
      <StyledTitlePage>Are you on Nostr?</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Do you have an account on the{" "}
        <Link href={"https://nostr.org/"} target="_blank">
          Nostr network
        </Link>
        ? Don&apos;t worry, it is not necessary to get started.
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
