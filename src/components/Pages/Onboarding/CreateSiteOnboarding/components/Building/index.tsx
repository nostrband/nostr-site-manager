import { useContext, useEffect, useState } from "react";
import {
  StyledAlert,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { detectContentType } from "@/services/nostr/onboard";

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
  if (progress === 0) {
    detectContentType(pubkey).then(([type, kinds]) => {
      console.log("pubkey", pubkey, type, kinds);
      if (!type) {
        router.replace("/onboarding/create-site?step=chooseAuthor");
      } else {
        // FIXME create site!
      }
    });
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 3);
    }, 100);

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
      <StyledTitlePage>We are building your website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        It takes about 10 seconds to create a website, please stand by
      </StyledDescriptionPage>
      <StyledAlert severity="info">
        We generate the site from your Nostr application content. Basic
        information and your publications will be added to the site
      </StyledAlert>
    </>
  );
};
