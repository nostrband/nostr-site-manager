import { Avatar, Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import {
  StyledIconButton,
  StyledWrapper,
} from "@/components/PreviewNavigation/styled";
import { useRouter, useSearchParams } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";

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

const themes = ["#cooking", "#photography", "#nostr", "#travel", "#grownostr"];

export const PreviewNavigation = () => {
  const [selectTheme, setSelectTheme] = useState<string[]>([]);
  const [isLogin, setIsLogin] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");
  const themeId = params.get("themeId");
  const filteredThemes = tag
    ? THEMES_PREVIEW.filter((theme) => theme.tag === tag)
    : THEMES_PREVIEW;
  let currentIndex = filteredThemes.findIndex((el) => el.id === themeId);
  let currentTheme = filteredThemes[currentIndex];

  const updateQueryParams = (id: string) => {
    const newParams = new URLSearchParams(params);

    newParams.set("themeId", id);

    router.push(`?${newParams.toString()}`);
  };

  const handleNext = () => {
    currentIndex = (currentIndex + 1) % filteredThemes.length;
    currentTheme = filteredThemes[currentIndex];

    updateQueryParams(currentTheme.id);
  };

  const handlePrev = () => {
    currentIndex =
      (currentIndex - 1 + filteredThemes.length) % filteredThemes.length;
    currentTheme = filteredThemes[currentIndex];

    updateQueryParams(currentTheme.id);
  };

  const handleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const handleNavigateToDesign = () => {
    router.push(`/design?themeId=${themeId}`);
  };

  const handleChange = (event: SelectChangeEvent<typeof selectTheme>) => {
    const {
      target: { value },
    } = event;
    setSelectTheme(typeof value === "string" ? value.split(",") : value);
  };

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
            xs: `${isLogin ? "calc(100% - 53px)" : "100%"}`,
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
          value={selectTheme}
          onChange={handleChange}
          MenuProps={MenuProps}
          sx={{
            height: "42px",
            width: { xs: `${isLogin ? "168px" : "100%"}`, sm: "168px" },
          }}
          renderValue={(selected) => {
            if (!selected.length) {
              return "All hashtags";
            }

            return selected.join(", ");
          }}
          displayEmpty
        >
          {themes.map((theme) => (
            <MenuItem key={theme} value={theme}>
              <Checkbox
                color="decorate"
                checked={selectTheme.indexOf(theme) > -1}
              />
              <ListItemText primary={theme} />
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
          if (isLogin) {
            handleNavigateToDesign();
          } else {
            handleLogin();
          }
        }}
      >
        Use theme
      </Button>
      {isLogin && (
        <Avatar
          alt="Remy Sharp"
          src="https://mui.com/static/images/avatar/1.jpg"
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
