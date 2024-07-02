"use client";
import { Container } from "@mui/material";
import {
  StyledButton,
  StyledButtonGroup,
  StyledPreviews,
  StyledWrap,
  StyledMoreButton,
} from "@/components/ThemesOnboarding/styled";
import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { ThemePreview } from "@/components/ThemePreview";
import { THEMES_PREVIEW, TYPES_THEMES_TAG } from "@/consts";

export const ThemesOnboarding = () => {
  const [activeTag, setActiveTag] = useState<TYPES_THEMES_TAG | null>(null);
  const [showAllThemes, setShowAllThemes] = useState(false);
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

  const displayedThemes = showAllThemes
    ? filteredData
    : filteredData.slice(0, maxThemesToShow);

  return (
    <StyledWrap>
      <Container maxWidth="lg" id="themes-onboarding">
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
                <ThemePreview preview={el.preview} id={el.id} tag={activeTag} />
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
  );
};
