import { Avatar, Box, Button, ListSubheader } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useContext, useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import {
  StyledIconButton,
  StyledWrapper,
} from "@/components/PreviewNavigation/styled";
import { useSearchParams } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import { AuthContext, userProfile, userPubkey } from "@/services/nostr/nostr";
import { ModalAuthor } from "@/components/ModalAuthor";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { fetchProfiles } from "@/services/nostr/api";
import { prefetchThemes } from "@/services/nostr/themes";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const PreviewNavigation = ({
  onContentSettings,
  onUseTheme,
  hashtagsSelected,
  kindsSelected,
  onChangeTheme,
  kinds,
  hashtags,
  author,
}: {
  onContentSettings: (
    author: string,
    hastags: string[],
    kinds: number[]
  ) => void;
  onUseTheme: () => void;
  onChangeTheme: (id: string) => void;
  hashtagsSelected: string[];
  kindsSelected: number[];
  kinds: { [key: number]: string };
  hashtags: string[];
  author: string;
}) => {
  const [isOpenModalAuthor, setOpenModalAuthor] = useState(false);
  const [profile, setProfile] = useState<NDKEvent | undefined>(undefined);
  const authed = useContext(AuthContext);
  const params = useSearchParams();
  const tag = params.get("tag");
  const themeId = params.get("themeId");
  const siteId = params.get("siteId");
  const filteredThemes =
    !siteId && tag
      ? THEMES_PREVIEW.filter((theme) => theme.tag === tag)
      : THEMES_PREVIEW;
  let currentIndex = filteredThemes.findIndex((el) => el.id === themeId);
  let currentTheme = filteredThemes[currentIndex];
  const selectedOptions = [...hashtagsSelected, ...kindsSelected];
  const prepareKindOptions = Object.keys(kinds).map((el) => Number(el));

  prefetchThemes([
    filteredThemes[(currentIndex + 1) % filteredThemes.length].id,
    filteredThemes[currentIndex > 0 ? currentIndex - 1 : filteredThemes.length - 1].id,
  ]);

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
    if (!authed) document.dispatchEvent(new Event("nlLaunch"));
  };

  const handleChange = (event: SelectChangeEvent<typeof selectedOptions>) => {
    const value = event.target.value as string[];
    const newHashtagsOptions = [];
    const newKindsOptions: number[] = [];

    const selectedHashtags = value.filter((option) =>
      hashtags.includes(option)
    );

    const selectedKinds = value
      .filter((option) => prepareKindOptions.includes(Number(option)))
      .map((el) => Number(el));

    if (selectedKinds.length === 0) {
      if (
        selectedOptions.some((option) =>
          prepareKindOptions.includes(Number(option))
        )
      ) {
        return;
      } else {
        newHashtagsOptions.push(...selectedHashtags);
        newKindsOptions.push(...prepareKindOptions);
      }
    } else if (selectedKinds.length === prepareKindOptions.length) {
      newHashtagsOptions.push(...selectedHashtags);
      newKindsOptions.push(...prepareKindOptions);
    } else {
      newHashtagsOptions.push(...selectedHashtags);
      newKindsOptions.push(...selectedKinds);
    }

    onContentSettings(author, newHashtagsOptions, newKindsOptions);
  };

  let avatar = "";
  let username = "";
  if (authed) {
    username = author;
    if (profile) {
      try {
        const meta = JSON.parse(profile.content);
        username = meta.display_name || meta.name || username;
        avatar = meta.picture || "";
      } catch {}
    }
  }

  const handleOpen = () => {
    setOpenModalAuthor(true);
  };

  const handleAuthor = (pubkey: string | any) => {
    setOpenModalAuthor(false);
    const cancel = typeof pubkey !== "string"
    onContentSettings(cancel ? author : pubkey, hashtagsSelected, kindsSelected);
  };

  return (
    <>
      <StyledWrapper>
        <StyledIconButton
          color="primary"
          size="large"
          onClick={handlePrev}
          sx={{ order: { xs: 1 }, marginRight: "auto" }}
        >
          <ArrowBackIcon />
        </StyledIconButton>

        {authed && (
          <Box
            sx={{
              width: {
                xs: `${authed ? "calc(100% - 53px)" : "100%"}`,
                sm: "auto",
              },
              order: { xs: 0, sm: 1 },
            }}
          >
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              size="small"
              value={selectedOptions}
              onChange={handleChange}
              MenuProps={MenuProps}
              sx={{
                height: "42px",
                width: { xs: `${authed ? "208px" : "100%"}`, sm: "208px" },
              }}
              renderValue={(selected) => {
                if (!selected.length) {
                  return "All notes";
                }

                const kindsNames = selected
                  .map((value) => {
                    // @ts-ignore
                    if (kinds[value]) {
                      // @ts-ignore
                      return kinds[value];
                    }

                    return "";
                  })
                  .filter((s) => !!s)
                  .join(", ");

                return [kindsNames, ...selected]
                  .map((value) => {
                    // @ts-ignore
                    if (kinds[value]) {
                      return "";
                    }

                    return value;
                  })
                  .filter((s) => !!s)
                  .join(", ");
              }}
              displayEmpty
            >
              <ListSubheader>Kinds</ListSubheader>
              {prepareKindOptions.map((kind) => (
                <MenuItem key={kind} value={kind}>
                  <Checkbox
                    color="decorate"
                    checked={selectedOptions.includes(kind)}
                  />
                  <ListItemText primary={kinds[kind]} />
                </MenuItem>
              ))}

              <ListSubheader>Hashtags</ListSubheader>
              {hashtags.map((hashtag) => (
                <MenuItem key={hashtag} value={hashtag}>
                  <Checkbox
                    color="decorate"
                    checked={selectedOptions.includes(hashtag)}
                  />
                  <ListItemText primary={hashtag} />
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
        <Button
          sx={{ order: { xs: 1 } }}
          size="large"
          variant="contained"
          color="decorate"
          onClick={() => {
            if (authed) {
              onUseTheme();
            } else {
              handleLogin();
            }
          }}
        >
          {authed ? "Use theme" : "Login to continue"}
        </Button>
        {authed && (
          <Avatar
            alt={username}
            src={avatar}
            sx={{ width: 43, height: 43, order: { xs: 0, sm: 1 } }}
            onClick={handleOpen}
          />
        )}
        <StyledIconButton
          onClick={handleNext}
          color="primary"
          size="large"
          sx={{ order: { xs: 1 }, marginLeft: "auto" }}
        >
          <ArrowForwardIcon />
        </StyledIconButton>
      </StyledWrapper>
      <ModalAuthor
        pubkey={author}
        isOpen={isOpenModalAuthor}
        handleClose={handleAuthor}
      />
    </>
  );
};
