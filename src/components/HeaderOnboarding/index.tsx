"use client";
import {
  StyledHeaderContainer,
  StyledHeaderOnboarding,
} from "@/components/HeaderOnboarding/styled";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "@/services/nostr/nostr";

export const HeaderOnboarding = () => {
  const router = useRouter();
  const authed = useContext(AuthContext);
  const handleNavigateToAdmin = () => {
    router.push("/admin");
  };

  return (
    <StyledHeaderOnboarding>
      <StyledHeaderContainer maxWidth="lg">
        <Typography variant="body1">
          <b>L O G O</b>
        </Typography>

        {authed && (
          <Button
            onClick={handleNavigateToAdmin}
            color="decorate"
            variant="contained"
          >
            My sites
          </Button>
        )}
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
