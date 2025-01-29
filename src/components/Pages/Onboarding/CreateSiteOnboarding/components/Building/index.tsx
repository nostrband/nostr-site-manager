import { useEffect, useState } from "react";
import {
  StyledAlert,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export const Building = () => {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 3);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (progress > 100) {
      router.push("/onboarding/create-site?step=chooseAuthor");
    }
  }, [progress, router]);

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
