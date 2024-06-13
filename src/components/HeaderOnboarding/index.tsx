"use client";
import {
  StyledHeaderContainer,
  StyledHeaderOnboarding,
} from "@/components/HeaderOnboarding/styled";
import { Button, Typography, Avatar } from "@mui/material";
import { useState } from "react";

export const HeaderOnboarding = () => {
  // For test login
  const [isLogin, setLogin] = useState(false);

  const handleLogin = () => {
    setLogin((prev) => !prev);
  };

  return (
    <StyledHeaderOnboarding>
      <StyledHeaderContainer maxWidth="lg">
        <Typography variant="body1">
          <b>L O G O</b>
        </Typography>

        {isLogin ? (
          <Avatar
            alt="Remy Sharp"
            onClick={handleLogin}
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ width: 64, height: 64 }}
          />
        ) : (
          <Button onClick={handleLogin} color="decorate" variant="contained">
            Log in
          </Button>
        )}
      </StyledHeaderContainer>
    </StyledHeaderOnboarding>
  );
};
