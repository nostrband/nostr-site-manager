import { Avatar, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyledButtonHashtagKind,
  StyledIconButton,
  StyledWrapper,
} from "@/components/PreviewNavigation/styled";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import { AuthContext } from "@/services/nostr/nostr";
import { ModalAuthor } from "@/components/ModalAuthor";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { prefetchThemes } from "@/services/nostr/themes";
import { ExpandMoreTwoTone as ExpandMoreTwoToneIcon } from "@mui/icons-material";
import { ModalHashtagsKinds } from "@/components/ModalHashtagsKinds";

export const PreviewNavigation = ({
  onContentSettings,
  onUseTheme,
  hashtagsSelected,
  kindsSelected,
  onChangeTheme,
  kinds,
  hashtags,
  author,
  noContentSettings,
  getHeightNavigation,
}: {
  onContentSettings: (
    author: string,
    hashtags: string[],
    kinds: number[],
  ) => void;
  onUseTheme: () => void;
  onChangeTheme: (id: string) => void;
  noContentSettings: boolean;
  hashtagsSelected: string[];
  kindsSelected: number[];
  kinds: { [key: number]: string };
  hashtags: string[];
  author: string;
  getHeightNavigation: (height: number) => void;
}) => {
  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [isOpenModalHashtagsKinds, setOpenModalHashtagsKinds] = useState(false);
  const [profile, setProfile] = useState<NDKEvent | undefined>(undefined);
  const { isAuth } = useContext(AuthContext);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const componentRef = useRef<HTMLDivElement>(null);

  const updateHeight = () => {
    if (componentRef.current) {
      getHeightNavigation(componentRef.current.clientHeight);
    }
  };

  useEffect(() => {
    updateHeight();

    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const createQueryString = useCallback(
    ({
      hashtagsData,
      kindsData,
    }: {
      hashtagsData: string;
      kindsData: string;
    }) => {
      const searchParams = new URLSearchParams(params.toString());

      if (hashtagsData.length) {
        searchParams.set("hashtags", hashtagsData);
      } else {
        searchParams.delete("hashtags");
      }

      if (kindsData.length) {
        searchParams.set("kinds", kindsData);
      } else {
        searchParams.delete("kinds");
      }

      return searchParams.toString();
    },
    [params],
  );

  const tag = params.get("tag");
  const themeId = params.get("themeId");
  const siteId = params.get("siteId");
  const filteredThemes =
    !siteId && tag
      ? THEMES_PREVIEW.filter((theme) => theme.tag === tag)
      : THEMES_PREVIEW;
  let currentIndex = filteredThemes.findIndex((el) => el.id === themeId);
  let currentTheme = filteredThemes[currentIndex];

  useEffect(() => {
    prefetchThemes([
      filteredThemes[(currentIndex + 1) % filteredThemes.length].id,
      filteredThemes[
        currentIndex > 0 ? currentIndex - 1 : filteredThemes.length - 1
      ].id,
    ]);
  }, [currentIndex, filteredThemes]);

  useEffect(() => {
    console.log("fetch author", author);
    fetchProfiles([author])
      .then((ps) => {
        if (ps.length) setProfile(ps[0]);
      })
      .catch(() => {});
  }, [author, setProfile]);

  const handleNext = () => {
    currentIndex = (currentIndex + 1) % filteredThemes.length;
    currentTheme = filteredThemes[currentIndex];

    onChangeTheme(currentTheme.id);
  };

  const handlePrev = () => {
    currentIndex =
      (currentIndex - 1 + filteredThemes.length) % filteredThemes.length;
    currentTheme = filteredThemes[currentIndex];

    onChangeTheme(currentTheme.id);
  };

  const handleLogin = () => {
    if (!isAuth) document.dispatchEvent(new Event("nlLaunch"));
  };

  const handleChange = (hashtagsData: string[], kindsData: number[]) => {
    const prepareHashtags = hashtagsData
      .map((str) => str.substring(1))
      .join(",");

    const prepareKinds = kindsData.join(",");

    router.push(
      `${pathname}?${createQueryString({ hashtagsData: prepareHashtags, kindsData: prepareKinds })}`,
    );

    onContentSettings(author, hashtagsData, kindsData);
  };

  useEffect(() => {
    const queryHashtags = params.get("hashtags");
    const queryKinds = params.get("kinds");

    const hashtagsArray = queryHashtags
      ? queryHashtags.split(",").map((el) => `#${el}`)
      : [];
    const kindsArray = queryKinds
      ? queryKinds.split(",").map((el) => Number(el))
      : [];

    if (hashtagsArray.length > 0 || kindsArray.length > 0) {
      onContentSettings(author, hashtagsArray, kindsArray);
    }
  }, [params]);

  let avatar = "";
  let username = "";
  if (isAuth) {
    username = author;
    if (profile) {
      try {
        const meta = JSON.parse(profile.content);
        username = meta.display_name || meta.name || username;
        avatar = meta.picture || "";
      } catch (e) {
        console.error(e);
      }
    }
  }

  const handleOpen = () => {
    setOpenModalAuthor(true);
  };

  const handleAuthor = (pubkey: string | any) => {
    setOpenModalAuthor(false);
    const cancel = typeof pubkey !== "string";
    onContentSettings(
      cancel ? author : pubkey,
      hashtagsSelected,
      kindsSelected,
    );
  };

  const handleCloseModalHashtagsKinds = () => {
    setOpenModalHashtagsKinds(false);
  };

  const handleOpenModalHashtagsKinds = () => {
    setOpenModalHashtagsKinds(true);
  };

  const kindsNames = kindsSelected.map((value) => {
    if (kinds[value]) {
      return kinds[value];
    }

    return "";
  });

  const selectedData = [...kindsNames, ...hashtagsSelected].join(", ");

  return (
    <>
      <StyledWrapper ref={componentRef}>
        <StyledIconButton
          size="large"
          onClick={handlePrev}
          sx={{ order: { xs: 1 }, marginRight: "auto" }}
        >
          <ArrowBackIcon />
        </StyledIconButton>

        {!noContentSettings && isAuth && (
          <Box
            sx={{
              width: {
                xs: `${isAuth ? "calc(100% - 53px)" : "100%"}`,
                sm: "auto",
              },
              order: { xs: 0, sm: 1 },
            }}
          >
            <StyledButtonHashtagKind
              sx={{
                height: "42px",
                width: { xs: `${isAuth ? "208px" : "100%"}`, sm: "208px" },
                justifyContent: "space-between",
              }}
              variant="outlined"
              onClick={handleOpenModalHashtagsKinds}
              endIcon={<ExpandMoreTwoToneIcon />}
            >
              <span>{selectedData.length ? selectedData : "All notes"}</span>
            </StyledButtonHashtagKind>
          </Box>
        )}
        <Button
          sx={{ order: { xs: 1 } }}
          size="large"
          variant="contained"
          onClick={() => {
            if (isAuth) {
              onUseTheme();
            } else {
              handleLogin();
            }
          }}
        >
          {isAuth ? "Use theme" : "Login to continue"}
        </Button>
        {!noContentSettings && isAuth && (
          <Avatar
            alt={username}
            src={avatar}
            sx={{
              width: 43,
              height: 43,
              cursor: "pointer",
              order: { xs: 0, sm: 1 },
            }}
            onClick={handleOpen}
          />
        )}
        <StyledIconButton
          onClick={handleNext}
          size="large"
          sx={{ order: { xs: 1 }, marginLeft: "auto" }}
        >
          <ArrowForwardIcon />
        </StyledIconButton>
      </StyledWrapper>

      {!noContentSettings && (
        <>
          <ModalAuthor
            pubkey={author}
            isOpen={isOpenModalAuthor}
            handleClose={handleAuthor}
          />
          <ModalHashtagsKinds
            hashtagsSelected={hashtagsSelected}
            kindsSelected={kindsSelected}
            kinds={kinds}
            hashtags={hashtags}
            isOpen={isOpenModalHashtagsKinds}
            handleClose={handleCloseModalHashtagsKinds}
            handleChange={handleChange}
          />
        </>
      )}
    </>
  );
};
