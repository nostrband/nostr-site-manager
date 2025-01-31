import { useContext, useEffect, useState } from "react";
import {
  StyledAlert,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { createSite, detectContentType } from "@/services/nostr/onboard";
import { enqueueSnackbar } from "notistack";

export const Building = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { isAuth, isLoading } = useContext(AuthContext);

  // redirect to login if not authed
  useEffect(() => {
    if (!isAuth && !isLoading) router.replace("/onboarding/start");
  }, [isAuth, isLoading]);

  // FIXME pass pubkey of chosen author
  const pubkey = userPubkey;

  useEffect(() => {
    if (progress > 0) return;

    // 30 sec / 100% = 300ms
    console.log("set interval");
    const timer = setInterval(() => {
      console.log("timer");
      setProgress((prevProgress) => (prevProgress + 1) % 100);
    }, 300);

    detectContentType(pubkey).then(async ([type, kinds]) => {
      console.log("pubkey", pubkey, type, kinds);
      if (!type) {
        clearInterval(timer);
        setProgress(0);
        router.replace("/onboarding/create-site?step=chooseAuthor");
      } else {
        try {
          await new Promise(ok => setTimeout(ok, 10000));
          await createSite(pubkey, type, kinds);
          setProgress(100);
        } catch (e) {
          enqueueSnackbar("Error: " + e, {
            autoHideDuration: 3000,
            variant: "warning",
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
        } finally {
          clearInterval(timer);
        }
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, []);

  // useEffect(() => {
  //   if (progress > 100) {
  //     router.push("/onboarding/create-site?step=chooseAuthor");
  //   }
  // }, [progress, router]);

  if (isLoading) return;

  return (
    <>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          color="decorate"
          variant="determinate"
          value={progress}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
      <StyledTitlePage>We are making your sample website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        It takes about 10 seconds to create a website, please stand by
      </StyledDescriptionPage>
      <StyledAlert severity="info">
        We are populating the site with content from Nostr. You
        can change site settings and manage the content
        later on inside your dashboard.
      </StyledAlert>
    </>
  );
};
