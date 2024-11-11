"use client";
import {
  StyledPreviewTestSite,
  StyledPreviewTestSiteNotAuth,
} from "@/components/Pages/Preview/styled";
import { PreviewNavigation } from "@/components/PreviewNavigation";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import { SUPPORTED_KIND_NAMES, THEMES_PREVIEW } from "@/consts";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getPreviewTopHashtags,
  getPreviewSiteId,
  renderPreview,
  setPreviewSettings,
  getPreviewHashtags,
  getPreviewKinds,
  Mutex,
  getPreviewSiteInfo,
  PreviewSettings,
} from "@/services/nostr/themes";
import { Box } from "@mui/material";
import { SpinerWrap } from "@/components/Spiner";
import { SpinnerCustom } from "@/components/SpinnerCustom";
import { PreviewHeader } from "@/components/PreviewHeader";
import { isEqual } from "lodash";
import { useSnackbar } from "notistack";

// const hashtags = [
//   "#cooking",
//   "#photography",
//   "#nostr",
//   "#travel",
//   "#grownostr",
// ];

const mutex = new Mutex();
let mounted = false;

export const Preview = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const params = useSearchParams();
  const themeId = params.get("themeId");
  const siteId = params.get("siteId");
  const theme = THEMES_PREVIEW.find((el) => el.id === themeId);

  const [contributor, setContributor] = useState<string | undefined>(
    siteId ? undefined : userPubkey,
  );
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagsSelected, setHashtagsSelected] = useState<
    string[] | undefined
  >(undefined);
  const [kindsSelected, setKinds] = useState<number[] | undefined>(undefined);
  const { isAuth } = useContext(AuthContext);
  const [isLoading, setLoading] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    mounted = true;
  }, []);

  useEffect(() => {
    // init contributor if we're not loading a site
    if (isAuth && !contributor && !siteId) setContributor(userPubkey);
  }, [isAuth]);

  useEffect(() => {
    if (!themeId || !theme) return;

    if (isAuth) {
      mutex.run(async () => {
        setLoading(true);

        try {
          const start = Date.now();

          const settings: PreviewSettings = {
            siteId: siteId || undefined,
            themeId,
          };
          if (!siteId) {
            settings.contributors = contributor ? [contributor] : undefined;
            settings.kinds = kindsSelected;
            settings.hashtags = hashtagsSelected;
          }

          const updated = await setPreviewSettings(settings);

          if (updated || mounted) {
            mounted = false;

            if (!siteId) {
              const info = getPreviewSiteInfo();
              console.log("info", info);
              const newContributor =
                info.contributor_pubkeys?.[0] || info.admin_pubkey;
              const newHashtags = await getPreviewTopHashtags();
              const newHashtagsSelected = getPreviewHashtags();
              const newKindsSelected = getPreviewKinds();

              // if we don't check for equality then
              // we might cause infinite loop if user
              // makes several changes in a sequence
              if (!isEqual(newContributor, contributor))
                setContributor(newContributor);
              if (!isEqual(newHashtags, hashtags)) setHashtags(newHashtags);
              if (!isEqual(newHashtagsSelected, hashtagsSelected))
                setHashtagsSelected(newHashtagsSelected);
              if (!isEqual(newKindsSelected, kindsSelected))
                setKinds(newKindsSelected);
            }

            // update the preview html
            await renderPreview(iframeRef.current!);
            console.log("updated preview in", Date.now() - start);
          }
        } catch (e: any) {
          console.log("error", e);
          enqueueSnackbar("Error: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
        }

        setLoading(false);
      });
    } else if (!siteId) {
      iframeRef.current!.src = theme.url;
    }
  }, [
    isAuth,
    themeId,
    theme,
    siteId,
    contributor,
    kindsSelected,
    hashtagsSelected,
    iframeRef,
    setHashtags,
    setKinds,
    setHashtagsSelected,
    setLoading,
    setContributor,
  ]);

  if (!themeId || !theme) {
    return redirect("/");
  }

  const onContentSettings = async (
    author: string,
    hashtags: string[],
    kinds: number[],
  ) => {
    console.log("onContentSettings", author, hashtags, kinds);
    setContributor(author);
    setHashtagsSelected(hashtags);
    setKinds(kinds);
  };

  const onUseTheme = async () => {
    const siteId = getPreviewSiteId();
    router.push(`/design?themeId=${themeId}&siteId=${siteId}`);
  };

  const onChangeTheme = async (id: string) => {
    const newParams = new URLSearchParams(params);

    newParams.set("themeId", id);

    router.push(`?${newParams.toString()}`);
  };

  const getHeightNavigation = (h: number) => {
    setHeight(h);
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
            <SpinnerCustom />
          </SpinerWrap>
        </Box>
      )}

      <PreviewHeader themeId={themeId} themeName={theme.name} />

      {!isAuth ? (
        <StyledPreviewTestSiteNotAuth sx={{ paddingBottom: `${height}px` }}>
          <iframe
            ref={iframeRef}
            style={{ border: 0 }}
            width={"100%"}
            height={"100%"}
          ></iframe>
        </StyledPreviewTestSiteNotAuth>
      ) : (
        <StyledPreviewTestSite sx={{ paddingBottom: `${height}px` }}>
          <iframe
            ref={iframeRef}
            style={{ border: 0 }}
            width={"100%"}
            height={"100%"}
          ></iframe>
        </StyledPreviewTestSite>
      )}

      <PreviewNavigation
        author={contributor || userPubkey}
        onChangeTheme={onChangeTheme}
        kindsSelected={kindsSelected || []}
        hashtagsSelected={hashtagsSelected || []}
        onContentSettings={onContentSettings}
        hashtags={hashtags}
        kinds={SUPPORTED_KIND_NAMES}
        onUseTheme={onUseTheme}
        noContentSettings={!!siteId}
        getHeightNavigation={getHeightNavigation}
      />
    </>
  );
};
