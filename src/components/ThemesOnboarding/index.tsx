"use client";
import { Container } from "@mui/material";
import {
  StyledButton,
  StyledButtonGroup,
  StyledPreviews,
  StyledWrap,
  StyledMoreButton,
  StyledTitle,
} from "@/components/ThemesOnboarding/styled";
import { useContext, useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { ThemePreview } from "@/components/ThemePreview";
import { THEMES_PREVIEW, TYPES_THEMES_TAG } from "@/consts";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/services/nostr/nostr";
import { ModalSites } from "@/components/ModalSites";
import { useListSites } from "@/hooks/useListSites";

export const ThemesOnboarding = () => {
  const { data } = useListSites();
  const router = useRouter();
  const authed = useContext(AuthContext);
  const [activeTag, setActiveTag] = useState<TYPES_THEMES_TAG | null>(null);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [themeId, setThemeId] = useState("");
  const maxThemesToShow = 9;

  const filteredData = useMemo(
    () =>
      activeTag
        ? THEMES_PREVIEW.filter((item) => item.tag === activeTag)
        : THEMES_PREVIEW,
    [activeTag],
  );

  const handleChoise = (tag: TYPES_THEMES_TAG) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setShowAllThemes(true);
  };

  const getColor = (tag: TYPES_THEMES_TAG) =>
    activeTag === tag ? "decorate" : "lightInfo";

  const handleMoreTheme = () => {
    setShowAllThemes((prev) => !prev);
  };

  const handleNavigate = (id: string) => {
    if (authed && data?.length) {
      setOpen(true);
      setThemeId(id);
      return;
    }

    router.push(
      `/preview?themeId=${id}${activeTag ? `&tag=${activeTag}` : ""}`,
    );
  };

  const handleClose = () => {
    setOpen(false);
    setThemeId("");
  };

  const displayedThemes = showAllThemes
    ? filteredData
    : filteredData.slice(0, maxThemesToShow);

  return (
    <>
      <StyledWrap>
        <Container maxWidth="lg" id="themes-onboarding">
          <StyledTitle>Pick a theme to start</StyledTitle>
          <StyledButtonGroup>
            <StyledButton
              color={getColor(TYPES_THEMES_TAG.MICROBLOG)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.MICROBLOG)}
            >
              Microblog
            </StyledButton>

            <StyledButton
              color={getColor(TYPES_THEMES_TAG.BLOG)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.BLOG)}
            >
              Blog
            </StyledButton>

            <StyledButton
              color={getColor(TYPES_THEMES_TAG.PODCAST)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.PODCAST)}
            >
              Podcast
            </StyledButton>

            <StyledButton
              color={getColor(TYPES_THEMES_TAG.RECIPES)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.RECIPES)}
            >
              Recipes
            </StyledButton>

            <StyledButton
              color={getColor(TYPES_THEMES_TAG.PHOTOGRAPHY)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.PHOTOGRAPHY)}
            >
              Photography
            </StyledButton>

            <StyledButton
              color={getColor(TYPES_THEMES_TAG.MAGAZINE)}
              variant="contained"
              onClick={() => handleChoise(TYPES_THEMES_TAG.MAGAZINE)}
            >
              Magazine
            </StyledButton>
          </StyledButtonGroup>

          <StyledPreviews>
            <Grid
              container
              spacing={{ xs: "15px", md: "30px" }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {displayedThemes.map((el, index) => (
                <Grid item xs={4} sm={4} md={4} key={index}>
                  <ThemePreview
                    preview={el.preview}
                    handleNavigate={() => handleNavigate(el.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </StyledPreviews>

          <StyledMoreButton>
            {!showAllThemes && (
              <StyledButton
                color="decorate"
                variant="contained"
                onClick={handleMoreTheme}
              >
                More Themes
              </StyledButton>
            )}
          </StyledMoreButton>
        </Container>
      </StyledWrap>
      <ModalSites
        handleClose={handleClose}
        themeId={themeId}
        tag={activeTag}
        isOpen={isOpen}
        sites={data ? data : []}
      />
    </>
  );
};
