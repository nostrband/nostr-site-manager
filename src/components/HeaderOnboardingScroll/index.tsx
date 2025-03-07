"use client";
import {
  StyledHeaderContainer,
  StyledAppBar,
  StyledLogo,
  StyledToolbar,
} from "@/components/HeaderOnboardingScroll/styled";
import { Button } from "@mui/material";
import { Logo } from "../Logo";
import Link from "next/link";

export const HeaderOnboardingScroll = ({
  isHeaderVisible,
}: {
  isHeaderVisible: boolean;
}) => {
  return (
    <StyledAppBar isHide={isHeaderVisible}>
      <StyledToolbar>
        <StyledHeaderContainer maxWidth="lg">
          <StyledLogo>
            <Logo />
          </StyledLogo>
          <Button
            size="large"
            variant="contained"
            color="decorate"
            LinkComponent={Link}
            href="/onboarding"
          >
            <b>Get started &rarr;</b>
          </Button>
        </StyledHeaderContainer>
      </StyledToolbar>
    </StyledAppBar>
  );
};
