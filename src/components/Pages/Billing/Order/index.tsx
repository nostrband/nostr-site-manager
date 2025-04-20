"use client";
import { Button, Container, Typography } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StyledWrapColumn } from "../styled";
import { StyledCardHead, StyledCardIcon, StyledWrapPage } from "./styled";
import { CheckCircleIcon } from "@/components/Icons";
import { getOrderById } from "@/services/billing.service";
import Link from "next/link";
import { StyledCard } from "@/components/shared/styled";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";
import { SiteBaseInfoPreview } from "@/components/shared/SiteBaseInfoPreview";

const Order = () => {
  const queryClient = useQueryClient();

  const [isPaid, setPaid] = useState(false);

  const params = useSearchParams();
  const siteId = params.get("siteId");
  const orderId = params.get("orderId");

  const { isLoadingBaseInfo, siteInfo } = useSiteBaseInfo(siteId);

  useEffect(() => {
    if (!orderId) return;

    const pingStatus = async () => {
      try {
        const order = await getOrderById(orderId);

        if (
          new Date(order.paid_timestamp * 1000).toDateString() ===
          new Date().toDateString()
        ) {
          setPaid(true);

          await queryClient.invalidateQueries({
            queryKey: ["billing-services"],
          });

          await queryClient.refetchQueries({
            queryKey: ["billing-services"],
          });
        }
      } catch (error) {
        console.error("Error pingStatus:", error);
      }
    };

    const intervalId = setInterval(pingStatus, 1500);

    if (isPaid) {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [orderId, isPaid, queryClient]);

  if (isLoadingBaseInfo) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <StyledWrapPage>
      <Container maxWidth="lg">
        <StyledWrapColumn>
          <StyledCard>
            <StyledCardHead>
              <StyledCardIcon>
                {isPaid ? (
                  <CheckCircleIcon color="success" fontSize="inherit" />
                ) : (
                  <SpinerCircularProgress />
                )}
              </StyledCardIcon>
              <Typography variant="h5">
                {isPaid ? "Your payment was successful" : "Waiting payment..."}
              </Typography>
              {isPaid && (
                <Typography variant="body4">
                  Premium customer support activated for 30 days
                </Typography>
              )}
            </StyledCardHead>

            <SiteBaseInfoPreview siteInfo={siteInfo} />

            {isPaid && (
              <Button
                component={Link}
                href={`/admin/${siteId}/dashboard`}
                size="large"
                variant="contained"
                fullWidth
              >
                Go to Dashboard
              </Button>
            )}
          </StyledCard>
        </StyledWrapColumn>
      </Container>
    </StyledWrapPage>
  );
};

export default Order;
