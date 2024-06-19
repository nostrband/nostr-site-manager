import {Avatar, Box, Button, ListSubheader} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useContext, useState } from "react";
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

const hashtags = [
  "#cooking",
  "#photography",
  "#nostr",
  "#travel",
  "#grownostr",
];

const kinds = [
    "short notes",
    "long notes",
];

export const PreviewNavigation = ({
  onHashtags,
  onUseTheme,
  onChangeTheme,
}: {
  onHashtags: (hastags: string[]) => void;
  onUseTheme: () => void;
  onChangeTheme: (id: string) => void;
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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
    const newSelectedOptions = [];

    const selectedHashtags = value.filter((option) => hashtags.includes(option));
    const selectedKinds = value.filter((option) => kinds.includes(option));

    if (selectedKinds.length === 0) {
      if (selectedOptions.some(option => kinds.includes(option))) {
        return;
      } else {
        newSelectedOptions.push(...selectedHashtags, ...kinds);
      }
    } else if (selectedKinds.length === kinds.length) {
      newSelectedOptions.push(...selectedHashtags, ...kinds);
    } else {
      newSelectedOptions.push(...selectedHashtags, ...selectedKinds);
    }

    setSelectedOptions(newSelectedOptions)
      onHashtags(newSelectedOptions);
  };

  let avatar = "";
  let username = "";
  if (authed) {
    username = userPubkey;
    if (userProfile) {
      try {
        const meta = JSON.parse(userProfile.content);
        username = meta.display_name || meta.name || username;
        avatar = meta.picture || "";
      } catch {}
    }
  }

  return (
    <StyledWrapper>
      <StyledIconButton
        color="primary"
        size="large"
        onClick={handlePrev}
        sx={{ order: { xs: 1 }, marginRight: "auto" }}
      >
        <ArrowBackIcon />
      </StyledIconButton>

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
            width: { xs: `${authed ? "168px" : "100%"}`, sm: "168px" },
          }}
          renderValue={(selected) => {
            if (!selected.length) {
              return "All hashtags";
            }

            return selected.join(", ");
          }}
          displayEmpty
        >
          <ListSubheader>Kinds</ListSubheader>
          {kinds.map((kind) => (
              <MenuItem key={kind} value={kind}>
                <Checkbox
                    color="decorate"
                    checked={selectedOptions.includes(kind)}
                />
                <ListItemText primary={kind} />
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
        Use theme
      </Button>
      {authed && (
        <Avatar
          alt={username}
          src={avatar}
          sx={{ width: 43, height: 43, order: { xs: 0, sm: 1 } }}
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
  );
};
