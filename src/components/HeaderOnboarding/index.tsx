"use client";
import {
  StyledHeaderContainer,
  StyledHeaderOnboarding,
} from "@/components/HeaderOnboarding/styled";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export const HeaderOnboarding = () => {
  const router = useRouter();
  const handleNavigateToAdmin = () => {
    router.push("/admin");
  };

  return (
    <StyledHeaderOnboarding>
      <StyledHeaderContainer maxWidth="lg">
        <Typography variant="body1">
          <b>L O G O</b>
        </Typography>

        {/* <Button
          onClick={handleNavigateToAdmin}
          color="decorate"
          variant="contained"
        >
          My sites
        </Button> */}
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
