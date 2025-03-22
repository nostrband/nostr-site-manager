"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { SpinnerPublishing } from "@/components/Pages/Publishing/components/SpinnerPublishing";
import {
  StyledDescription,
  StyledTitle,
  StyledWrap,
} from "@/components/Pages/Publishing/styled";
import { Button } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getPreviewPublishingState,
  getPreviewSiteInfo,
  publishPreviewSite,
  setPreviewSettings,
} from "@/services/nostr/themes";
import { AuthContext } from "@/services/nostr/nostr";
import { Site } from "libnostrsite";
import { Alert, AlertTitle } from "@mui/lab";
import { useSnackbar } from "notistack";
import { Mutex } from "@/services/nostr/utils";

const mutex = new Mutex();

const Publishing = () => {
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const params = useSearchParams();
  const siteId = params.get("siteId");
  const themeId = params.get("themeId");

  const [state, setState] = useState<"init" | "pub" | "done">("init");
  const [info, setInfo] = useState<Site | undefined>();
  const [error, setError] = useState(false);

  const handleClick = () => {
    window.open(info!.origin! + info!.url!, "_blank");
  };

  const title =
    state === "done"
      ? "Your site is ready!"
      : "Please wait as we prepare your site ...";
  const description =
    state === "done" ? (
      <>
        You can manage your site settings in your{" "}
        <Link href={`/admin/${siteId}`}>dashboard</Link>.
      </>
    ) : (
      `This may take 5-10 seconds to complete. Please do not close this page.`
    );

  useEffect(() => {
    const s = getPreviewPublishingState();
    if (s === "init")
      router.push(`/design?themeId=${themeId}&siteId=${siteId}`);
    else if (s === "done") setState("done");
  }, []);

  useEffect(() => {
    if (state !== "init" || !isAuth || !themeId || !siteId) return;

    mutex.run(async () => {
      if (getPreviewPublishingState() !== "publishing") return;
      setState("pub");

      try {
        const start = Date.now();
        console.log("publishing site");
        await setPreviewSettings({
          themeId,
          siteId,
          design: true,
        });

        await publishPreviewSite();
        console.log("published in", Date.now() - start);

        // url is updated now
        setInfo(getPreviewSiteInfo());

        // done
        setState("done");
      } catch (e: any) {
        console.log("error", e);
        setError(e.toString());
        setState("init");

        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      }
    });
  }, [isAuth, themeId, siteId, state, setState]);

  const tryAgain = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <StyledWrap>
        <Alert sx={{ maxWidth: "300px" }} severity="error">
          <AlertTitle>Error</AlertTitle>
          An error occurred, please reload the page to try again
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: "10px" }}
            onClick={tryAgain}
          >
            Try again
          </Button>
        </Alert>
      </StyledWrap>
    );
  }

  return (
    <StyledWrap>
      <SpinnerPublishing isLoading={state !== "done"} />
      <StyledTitle variant="h5">{title}</StyledTitle>
      <StyledDescription variant="body4">{description}</StyledDescription>
      {state === "done" && (
        <Button onClick={handleClick} size="large" variant="contained">
          Open site
        </Button>
      )}
    </StyledWrap>
  );
};

export default Publishing;
