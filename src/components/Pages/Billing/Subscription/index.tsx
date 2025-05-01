"use client";
import { Container, Button } from "@mui/material";
import { SpinerWrap, SpinerCircularProgress } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage } from "@/components/shared/styled";
import { StyledWrapColumn } from "../styled";
import { SubscriptionItem } from "./components/SubscriptionItem";
import { useRouter } from "next/navigation";
import { useSubscriptionFlow } from "../hooks/useSubscriptionFlow";
import { useEffect, useRef } from "react";

const Subscription = () => {
  
  const router = useRouter();
  const {
    isLoading,
    isDisabled,
    handleSubscribe,
    isSubscribing,
    siteInfo,
    currencies,
  } = useSubscriptionFlow();

  const linkRef = useRef(null);

  useEffect(() => {

    setTimeout(() => {
      // @ts-expect-error err
      linkRef.current?.click();
    }, 5000);

  }, [])

  if (isLoading) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledWrapColumn>
        <StyledTitlePage>
          <Button
            onClick={router.back}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Subscription
        </StyledTitlePage>
        <a
        ref={linkRef}
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Перейти на example.com
      </a>
        <SubscriptionItem
          isLoading={isSubscribing}
          isDisabled={isDisabled}
          onClick={handleSubscribe}
          siteInfo={siteInfo}
          prices={currencies}
        />
      </StyledWrapColumn>
    </Container>
  );
};

export default Subscription;
