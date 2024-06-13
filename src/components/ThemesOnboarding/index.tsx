"use client";
import { Container } from "@mui/material";
import {
  StyledButton,
  StyledButtonGroup,
  StyledPreviews,
} from "@/components/ThemesOnboarding/styled";
import { useMemo, useState } from "react";
import Grid from "@mui/material/Grid";
import { ThemePreview } from "@/components/ThemePreview";
import img1 from "../../../public/images/preview-theme/1.png";
import img2 from "../../../public/images/preview-theme/2.png";
import img3 from "../../../public/images/preview-theme/3.png";
import img4 from "../../../public/images/preview-theme/4.png";
import img5 from "../../../public/images/preview-theme/5.png";
import img6 from "../../../public/images/preview-theme/6.png";
import img7 from "../../../public/images/preview-theme/7.png";
import img8 from "../../../public/images/preview-theme/8.png";
import img9 from "../../../public/images/preview-theme/9.png";
import img10 from "../../../public/images/preview-theme/10.png";
import img11 from "../../../public/images/preview-theme/11.png";
import img12 from "../../../public/images/preview-theme/12.png";

enum TYPES_THEMES_TAG {
  BLOG = "blog",
  PODCAST = "podcast",
  PHOTOGRAPHY = "photography",
  RECIPES = "recipes",
}

const data = [
  {
    id: 1,
    tag: "blog",
    preview: img1,
  },
  {
    id: 2,
    tag: "podcast",
    preview: img2,
  },
  {
    id: 3,
    tag: "recipes",
    preview: img3,
  },
  {
    id: 4,
    tag: "photography",
    preview: img4,
  },

  {
    id: 5,
    tag: "blog",
    preview: img5,
  },
  {
    id: 6,
    tag: "podcast",
    preview: img6,
  },
  {
    id: 7,
    tag: "recipes",
    preview: img7,
  },
  {
    id: 8,
    tag: "photography",
    preview: img8,
  },

  {
    id: 9,
    tag: "blog",
    preview: img9,
  },
  {
    id: 10,
    tag: "podcast",
    preview: img10,
  },
  {
    id: 11,
    tag: "recipes",
    preview: img11,
  },
  {
    id: 12,
    tag: "photography",
    preview: img12,
  },
];

export const ThemesOnboarding = () => {
  const [activeTags, setActiveTags] = useState<Set<TYPES_THEMES_TAG>>(
    new Set(),
  );

  const filteredData = useMemo(
    () =>
      data.filter(
        (item) =>
          activeTags.size === 0 || activeTags.has(item.tag as TYPES_THEMES_TAG),
      ),
    [activeTags],
  );

  const handleChoise = (tag: TYPES_THEMES_TAG) => {
    setActiveTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const getColor = (tag: TYPES_THEMES_TAG) =>
    activeTags.has(tag) ? "decorate" : "lightInfo";

  return (
    <Container maxWidth="lg">
      <StyledButtonGroup>
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
      </StyledButtonGroup>

      {/*<Box*/}
      {/*    sx={{*/}
      {/*      width: '50vw',*/}
      {/*      height: '50vw',*/}
      {/*      maxWidth: '809px',*/}
      {/*      maxHeight: '90vh',*/}
      {/*      backgroundColor: '#FF3ED9',*/}
      {/*      borderRadius: '50%',*/}
      {/*      filter: 'blur(248px)',*/}
      {/*      position: "absolute",*/}
      {/*      left: '20%',*/}
      {/*      margin: "auto",*/}
      {/*      transform: 'rotate(30deg) translateX(-115px)',*/}
      {/*      zIndex: 1,*/}
      {/*      opacity: 0.3,*/}
      {/*    }}*/}
      {/*></Box>*/}
      {/*<Box*/}
      {/*    sx={{*/}
      {/*      width: '50vw',*/}
      {/*      height: '50vw',*/}
      {/*      maxWidth: '809px',*/}
      {/*      maxHeight: '90vh',*/}
      {/*      backgroundColor: '#2F50FF',*/}
      {/*      borderRadius: '50%',*/}
      {/*      filter: 'blur(248px)',*/}
      {/*      position: "absolute",*/}
      {/*      right: '20%',*/}
      {/*      margin: "auto",*/}
      {/*      transform: 'rotate(30deg)',*/}
      {/*      opacity: 0.3,*/}
      {/*    }}*/}
      {/*></Box>*/}

      <StyledPreviews>
        <Grid
          container
          spacing={{ xs: "15px", md: "30px" }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {filteredData.map((el, index) => (
            <Grid item xs={4} sm={4} md={4} key={index}>
              <ThemePreview preview={el.preview} id={el.id} />
            </Grid>
          ))}
        </Grid>
      </StyledPreviews>
    </Container>
  );
};
