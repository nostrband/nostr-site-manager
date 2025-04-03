"use client";
import {
  StyledButton,
  StyledButtonGroup,
  StyledPreviews,
  StyledTitle,
} from "@/components/AddWebSite/styled";
import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { ThemePreview } from "@/components/ThemePreview";
import { THEMES_PREVIEW, TYPES_THEMES_TAG } from "@/consts";
import { useRouter } from "next/navigation";

export const AddWebSite = () => {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState<TYPES_THEMES_TAG | null>(null);

  const filteredData = useMemo(
    () =>
      activeTag
        ? THEMES_PREVIEW.filter((item) => item.tag === activeTag)
        : THEMES_PREVIEW,
    [activeTag],
  );

  const handleChoise = (tag: TYPES_THEMES_TAG) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  const getColor = (tag: TYPES_THEMES_TAG) =>
    activeTag === tag ? "primary" : "secondary";

  const handleNavigate = (id: string) => {
    router.push(
      `/preview?themeId=${id}${activeTag ? `&tag=${activeTag}` : ""}`,
    );
  };

  return (
    <>
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

        <StyledButton
          color={getColor(TYPES_THEMES_TAG.APPS)}
          variant="contained"
          onClick={() => handleChoise(TYPES_THEMES_TAG.APPS)}
        >
          App
        </StyledButton>
      </StyledButtonGroup>

      <StyledPreviews>
        <Grid
          container
          spacing={{ xs: "15px", md: "30px" }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {filteredData.map((el, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <ThemePreview
                preview={el.preview}
                handleNavigate={() => handleNavigate(el.id)}
              />
            </Grid>
          ))}
        </Grid>
      </StyledPreviews>
    </>
  );
};
