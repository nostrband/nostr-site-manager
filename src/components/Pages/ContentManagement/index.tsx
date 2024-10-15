"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Typography,
  Grid,
  useMediaQuery,
  DialogContent,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Box,
  OutlinedInput,
} from "@mui/material";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TitleAdmin } from "@/components/TitleAdmin";
import {
  AvatarContributor,
  GroupContributors,
  TitleSection,
  TitleSiteName,
} from "./styled";
import { SearchPost, searchPosts } from "@/services/nostr/content";
import { useParams } from "next/navigation";
import { AuthorFilter, OptionAuthorType } from "./Filter/components/Author";
import { HashtagsFilter } from "./Filter/components/Hashtags";
import { TypesFilter } from "./Filter/components/Types";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { enqueueSnackbar } from "notistack";
import { useFormik } from "formik";
import { format, parseISO } from "date-fns";

// const sampleCards = [
//   {
//     title: "Card 1",
//     description: "This is the description for Card 1.",
//     type: "manual-submitted",
//     datetime: "2024-10-01",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Hashtag 1", "Hashtag 2"],
//     url: "https://example.com/card1",
//     status: "auto",
//   },
//   {
//     title: "Card 2",
//     description: "This is the description for Card 2.",
//     type: "auto-submitted",
//     datetime: "2024-10-02",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Hashtag 3"],
//     url: "https://example.com/card2",
//     status: "manual",
//   },
//   {
//     title: "Card 3",
//     description: "This is the description for Card 3.",
//     type: "manual-submitted",
//     datetime: "2024-10-03",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Nature", "Outdoors"],
//     url: "https://example.com/card3",
//     status: "",
//   },
//   {
//     title: "Card 4",
//     description: "This is the description for Card 4.",
//     type: "auto-submitted",
//     datetime: "2024-10-04",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Forest", "Adventure"],
//     url: "https://example.com/card4",
//     status: "",
//   },
//   {
//     title: "Card 5",
//     description: "This is the description for Card 5.",
//     type: "manual-submitted",
//     datetime: "2024-10-05",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Mountain", "Scenery"],
//     url: "https://example.com/card5",
//     status: "",
//   },
//   {
//     title: "Card 6",
//     description: "This is the description for Card 6.",
//     type: "auto-submitted",
//     datetime: "2024-10-06",
//     image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
//     hashtags: ["Beach", "Relaxation"],
//     url: "https://example.com/card6",
//     status: "manual",
//   },
// ];

type InputObject = {
  authors: string[];
  kinds: number[];
  hashtags: string[];
  since?: number;
  until?: number;
  search: string;
};

const initialValues: {
  authors: OptionAuthorType[];
  kinds: number[];
  hashtags: string[];
  since?: number;
  until?: number;
  search: string;
} = {
  authors: [],
  kinds: [],
  hashtags: [],
  since: undefined,
  until: undefined,
  search: "",
};

export const ContentManagement = () => {
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data } = useSettingsSite(siteId);

  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<SearchPost[]>([]);

  const [selectedDateSince, setSelectedDateSince] = useState<Date | null>(null);
  const [selectedUntilSince, setSelectedDateUntil] = useState<Date | null>(
    null,
  );

  const { values, submitForm, setFieldValue, handleChange, handleBlur } =
    useFormik({
      initialValues,
      onSubmit: async (values) => {
        setIsLoading(true);

        const prepareData = {
          authors: values.authors.map((el) => el.pubkey),
          kinds: values.kinds,
          hashtags: values.hashtags.map((str) => str.slice(1)),
          since: values.since,
          until: values.until,
          search: values.search,
        };

        function transformObject(input: InputObject): Partial<InputObject> {
          const { authors, kinds, hashtags, since, until, search } = input;

          const result: Partial<InputObject> = {};

          if (authors.length > 0) {
            result.authors = authors;
          }
          if (kinds.length > 0) {
            result.kinds = kinds;
          }
          if (hashtags.length > 0) {
            result.hashtags = hashtags;
          }
          if (since !== undefined) {
            result.since = since / 1000;
          }
          if (until !== undefined) {
            result.until = until / 1000;
          }
          if (search.length > 0) {
            result.search = search;
          }

          return result;
        }

        const transformedObject = transformObject(prepareData);

        try {
          const posts = await searchPosts(siteId, transformedObject);

          console.log({ posts, transformedObject });
          setCards(posts);
        } catch (e: any) {
          enqueueSnackbar("Error: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
        } finally {
          setIsLoading(false);
        }
      },
    });

  const handleChangeAuthors = (value: OptionAuthorType[]) => {
    setFieldValue("authors", value);
  };

  const handleChangeHashtags = (value: string[]) => {
    setFieldValue("hashtags", value);
  };

  const handleChangeTypes = (value: number[]) => {
    setFieldValue("kinds", value);
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const handleDateSinceChange = (newValue: Date | null) => {
    setSelectedDateSince(newValue);

    if (newValue) {
      setFieldValue("since", newValue.getTime());
    } else {
      setFieldValue("since", undefined);
    }
  };

  const handleDateUntilChange = (newValue: Date | null) => {
    setSelectedDateUntil(newValue);

    if (newValue) {
      setFieldValue("until", newValue.getTime());
    } else {
      setFieldValue("until", undefined);
    }
  };

  const FilterContent = () => (
    <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
      <Grid item xs={12} sm={6} md={3}>
        <Typography variant="body1" component="div">
          <b>Author</b>
        </Typography>
        <FormControl fullWidth>
          <AuthorFilter
            selectedAuthors={values.authors}
            handleChangeAuthors={handleChangeAuthors}
            contributors={data?.contributors ? data?.contributors : []}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Types</b>
          </Typography>
          <TypesFilter
            selectedTypes={values.kinds}
            handleChangeTypes={handleChangeTypes}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <Typography variant="body1" component="div">
            <b>Since</b>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDateSince}
              onChange={handleDateSinceChange}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <Typography variant="body1" component="div">
            <b>Until</b>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedUntilSince}
              onChange={handleDateUntilChange}
            />
          </LocalizationProvider>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Hashtags</b>
          </Typography>
          <HashtagsFilter
            contributors={data?.contributors ? data?.contributors : []}
            selectedHashtags={values.hashtags}
            handleChangeHashtags={handleChangeHashtags}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Search</b>
          </Typography>
          <OutlinedInput
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.search}
            size="medium"
            placeholder="Some text"
            name="search"
          />
        </FormControl>
      </Grid>

      <Grid
        item
        xs={12}
        sm={6}
        md={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <FormControl fullWidth>
          <Button
            variant="contained"
            color="decorate"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{ height: "56px" }}
            onClick={submitForm}
          >
            Accept
          </Button>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <>
      <TitleAdmin>Content management</TitleAdmin>

      <GroupContributors>
        <AvatarContributor src={data?.image} variant="rounded">
          <InsertPhotoOutlinedIcon />
        </AvatarContributor>
        <TitleSiteName variant="h5">{data?.name}</TitleSiteName>
      </GroupContributors>

      <TitleSection variant="h5">Filter</TitleSection>

      {!isMobile ? (
        <FilterContent />
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleOpenFilterDialog}
            sx={{ marginBottom: "20px" }}
          >
            Open Filter
          </Button>
          <Dialog
            open={isFilterDialogOpen}
            onClose={handleCloseFilterDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              Filter
              <IconButton
                aria-label="close"
                onClick={handleCloseFilterDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <FilterContent />
            </DialogContent>
          </Dialog>
        </>
      )}

      <TitleSection variant="h5">Results</TitleSection>

      {isLoading ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "200px" }}
        >
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {cards.map((card, index) => {
            const date = parseISO(card.created_at);

            const readableDate = format(date, "dd MMMM yyyy");

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={card.feature_image as string}
                    alt={card.title as string}
                    sx={{ borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.event.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {readableDate}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    ></Typography>
                    {card.status && (
                    <Chip
                    icon={<VerifiedOutlinedIcon color="inherit" />}
                    label={
                      card.status === "auto"
                        ? "Auto-submitted"
                        : "Manual-submitted"
                    }
                    size="small"
                    sx={{
                      marginTop: 1,
                      color: "green",
                      backgroundColor: "#e2fef0",
                    }}
                  />
                    )}
                    <Box mt={1}>
                      {card.tags.map((tag, idx) => (
                        <Chip
                          label={tag.name}
                          key={idx}
                          size="small"
                          sx={{ marginRight: 0.5, backgroundColor: "#e0e0e0" }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {card.status === "" ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        href={card.url}
                        target="_blank"
                      >
                        Submit
                      </Button>
                    ) : (
                      <Button size="small" variant="outlined" color="error">
                        Delete
                      </Button>
                    )}
                    <Button size="small">
                      <MoreVertIcon />
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </>
  );
};
