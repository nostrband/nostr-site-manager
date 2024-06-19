"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
import { PreviewNavigation } from "@/components/PreviewNavigation";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  loadPreviewSite,
  renderPreview,
  setPreviewSettings,
  setPreviewTheme,
  storePreview,
} from "@/services/nostr/themes";
import { Box } from "@mui/material";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";

const hashtags = [
  "#cooking",
  "#photography",
  "#nostr",
  "#travel",
  "#grownostr",
];

const kinds: { [key: number]: string } = {
  1: "Short notes",
  30023: "Long notes",
};

export const Preview = () => {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");
  const themeId = params.get("themeId");
  const siteId = params.get("siteId");
  const theme = THEMES_PREVIEW.find((el) => el.id === themeId);
  const getKinds = (params.get("kinds") || "")
    .split(",")
    .filter((k) => k.trim())
    .map((k) => parseInt(k));
  if (!getKinds.length)
    getKinds.push(
      tag === "photography" || tag === "magazine" || tag === "podcast"
        ? 1
        : 30023,
    );

  const [hashtagsSelected, setHashtags] = useState<string[]>([]);
  const [kindsSelected, setKinds] = useState(getKinds);
  const authed = useContext(AuthContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!themeId || !theme) return;

    if (authed) {
      setPreviewTheme(themeId);

      let promise;
      if (siteId) {
        promise = loadPreviewSite(siteId);
      } else {
        promise = Promise.resolve(
          setPreviewSettings({
            admin: userPubkey,
            // FIXME DEBUG
            contributors: [
              "1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411",
            ], //[userPubkey],
            kinds: kindsSelected,
            hashtags: hashtagsSelected,
          }),
        );
      }

      promise.then(() => renderPreview(iframeRef.current!));
    } else if (!siteId) {
      iframeRef.current!.src = theme.url;
    }
  }, [authed, kindsSelected, hashtagsSelected, themeId, siteId, iframeRef]);

  if (!themeId || !theme) {
    return redirect("/");
  }

  const onContentSettings = async (hashtags: string[], kinds: number[]) => {
    setHashtags(hashtags);
    setKinds(kinds);
  };

  const onUseTheme = async () => {
    const siteId = await storePreview();
    router.push(`/design?themeId=${themeId}&siteId=${siteId}`);
  };

  const onChangeTheme = async (id: string) => {
    await storePreview();

    const newParams = new URLSearchParams(params);

    newParams.set("themeId", id);

    router.push(`?${newParams.toString()}`);
  };

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 99,
            background: "#fff",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpinerWrap>
            <SpinerCircularProgress />
          </SpinerWrap>
        </Box>
      )}

      <StyledPreviewTestSite>
        <iframe
          ref={iframeRef}
          frameBorder={0}
          width={"100%"}
          height={"100%"}
        ></iframe>
      </StyledPreviewTestSite>

      <PreviewNavigation
        onChangeTheme={onChangeTheme}
        kindsSelected={kindsSelected}
        hashtagsSelected={hashtagsSelected}
        onContentSettings={onContentSettings}
        hashtags={hashtags}
        kinds={kinds}
        onUseTheme={onUseTheme}
      />
    </>
  );
};
