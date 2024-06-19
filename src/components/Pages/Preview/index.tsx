"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
// import Image, { StaticImageData } from "next/image";
import { PreviewNavigation } from "@/components/PreviewNavigation";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import { useContext, useEffect, useRef, useState } from "react";
import {
  loadPreviewSite,
  renderPreview,
  setPreviewSettings,
  setPreviewTheme,
  storePreview,
} from "@/services/nostr/themes";

export const Preview = () => {
  const router = useRouter();

  const params = useSearchParams();
  const tag = params.get("tag");
  const themeId = params.get("themeId");
  const siteId = params.get("siteId");
  const theme = THEMES_PREVIEW.find((el) => el.id === themeId);
  const kinds = (params.get("kinds") || "")
    .split(",")
    .filter((k) => k.trim())
    .map((k) => parseInt(k));
  if (!kinds.length)
    kinds.push(
      tag === "photography" || tag === "magazine" || tag === "podcast"
        ? 1
        : 30023
    );
  const authed = useContext(AuthContext);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!themeId || !theme) return;

    if (authed) {
      setPreviewTheme(themeId);

      let promise;
      if (siteId) {
        promise = loadPreviewSite(siteId);
      } else {
        promise = Promise.resolve(setPreviewSettings({
          admin: userPubkey,
          // FIXME DEBUG
          contributors: [
            "1bc70a0148b3f316da33fe3c89f23e3e71ac4ff998027ec712b905cd24f6a411",
          ], //[userPubkey],
          kinds,
          hashtags,
        }));  
      }

      promise.then(() => renderPreview(iframeRef.current!));
    } else if (!siteId) {
      iframeRef.current!.src = theme.url;
    }
  }, [authed, kinds, hashtags, themeId, siteId, iframeRef]);

  if (!themeId || !theme) {
    return redirect("/");
  }

  const onHashtags = async (hashtags: string[]) => {
    setHashtags(hashtags);
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
      <StyledPreviewTestSite>
        <iframe
          ref={iframeRef}
          frameBorder={0}
          width={"100%"}
          height={"100%"}
        ></iframe>
        {/* <Image src={theme?.preview as StaticImageData} alt="test site" /> */}
      </StyledPreviewTestSite>

      <PreviewNavigation onChangeTheme={onChangeTheme} onHashtags={onHashtags} onUseTheme={onUseTheme} />
    </>
  );
};
