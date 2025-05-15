"use client";
import { Button, DialogTitle, Fab, Typography } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  StyledWrap,
  StyledContainer,
  StyledCardHead,
  StyledCardIcon,
  StyledWrapPage,
  StyledDialogContent,
  StyledTitle,
  StyledDialog,
} from "./styled";
import { CheckCircleIcon, CrossIcon } from "@/components/Icons";
import { getOrderById } from "@/services/billing.service";
import Link from "next/link";
import { StyledCard } from "@/components/shared/styled";
import { useQueryClient } from "@tanstack/react-query";
import { useSiteBaseInfo } from "@/hooks/useSiteBaseInfo";
import { SiteBaseInfoPreview } from "@/components/shared/SiteBaseInfoPreview";

const Order = () => {
  const queryClient = useQueryClient();

  const [isPaid, setPaid] = useState(false);
  const [isOpenModal, setOpenModal] = useState(true);

  const params = useSearchParams();
  const siteId = params.get("siteId");
  const orderId = params.get("orderId");
  const checkoutUrl = params.get("checkoutUrl");

  const { isLoadingBaseInfo, siteInfo } = useSiteBaseInfo(siteId);

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  useEffect(() => {
    if (!orderId) return;

    const pingStatus = async () => {
      try {
        const order = await getOrderById(orderId);

        if (order) {
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
    <>
      <StyledWrapPage>
        <StyledContainer maxWidth="lg">
          <StyledWrap>
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
                  {isPaid
                    ? "Your payment was successful"
                    : "Waiting payment..."}
                </Typography>
                {isPaid && (
                  <Typography variant="body4">
                    Premium features activated for 30 days
                  </Typography>
                )}
              </StyledCardHead>

              {siteId && <SiteBaseInfoPreview siteInfo={siteInfo} />}
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={handleOpenModal}
              >
                {isPaid ? "Open details payments" : "Open payments process"}
              </Button>
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
          </StyledWrap>
        </StyledContainer>
      </StyledWrapPage>

      <StyledDialog
        open={isOpenModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle component="div" id="alert-dialog-title">
          <StyledTitle variant="body1">
            {isPaid ? "Details payments" : "Payments process"}
            <Fab onClick={handleOpenModal} size="small" aria-label="close">
              <CrossIcon />
            </Fab>
          </StyledTitle>
        </DialogTitle>
        <StyledDialogContent>
          {checkoutUrl && (
            <iframe
              style={{
                width: "100%",
                height: "100%",
                border: 0,
                background: "#fff",
              }}
              src={checkoutUrl}
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </StyledDialogContent>
      </StyledDialog>
    </>
  );
};

export default Order;
