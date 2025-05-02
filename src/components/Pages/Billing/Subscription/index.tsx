"use client";
import { Container, Button } from "@mui/material";
import { SpinerWrap, SpinerCircularProgress } from "@/components/Spiner";
import { ChevronLeftIcon } from "@/components/Icons";
import { StyledTitlePage } from "@/components/shared/styled";
import { StyledWrapColumn } from "../styled";
import { SubscriptionItem } from "./components/SubscriptionItem";
import { useRouter } from "next/navigation";
import { useSubscriptionFlow } from "../hooks/useSubscriptionFlow";

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
        <iframe
          style={{
            width: "100%",
            height: "300px",
            border: 0,
            background: "#fff",
          }}
          src="https://example.com"
          sandbox="allow-scripts"
        ></iframe>
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
