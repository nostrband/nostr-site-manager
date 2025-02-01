import { useEffect, useState } from "react";
import {
  StyledAlert,
  StyledDescriptionPage,
  StyledTitlePage,
} from "../../../styled";
import { CircularProgress, Typography } from "@mui/material";
import { createSite, detectContentType } from "@/services/nostr/onboard";
import { enqueueSnackbar } from "notistack";
import { StyledBuildingProgress, StyledBuildingProgressText } from "../styled";
import { SCREEN, TypesScreens } from "@/consts";

interface BuildingProps {
  setScreen: (screen: TypesScreens) => void;
  pubkey: string
}

export const Building = ({ setScreen, pubkey }: BuildingProps) => {
  const [progress, setProgress] = useState(0);

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

        setScreen(SCREEN.CHOOSE_AUTHOR)
      } else {
        try {
          await new Promise((ok) => setTimeout(ok, 10000));
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

  return (
    <>
      <StyledBuildingProgress>
        <CircularProgress
          color="decorate"
          variant="determinate"
          value={progress}
        />
        <StyledBuildingProgressText>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "text.secondary" }}
          >{`${Math.round(progress)}%`}</Typography>
        </StyledBuildingProgressText>
      </StyledBuildingProgress>
      <StyledTitlePage>We are making your sample website</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        It takes about 10 seconds to create a website, please stand by
      </StyledDescriptionPage>
      <StyledAlert severity="info">
        We are populating the site with content from Nostr. You can change site
        settings and manage the content later on inside your dashboard.
      </StyledAlert>
    </>
  );
};
