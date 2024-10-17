"use client";

import {
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { AuthorFilter, OptionAuthorType } from "./components/Author";
import { memo, useCallback, useState } from "react";
import { useFormik } from "formik";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { enqueueSnackbar } from "notistack";
import { SearchPost, searchPosts } from "@/services/nostr/content";
import { TypesFilter } from "./components/Types";
import { HashtagsFilter } from "./components/Hashtags";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

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

interface IFilter {
  handleLoading: (state: boolean) => void;
  siteData: ReturnSettingsSiteDataType;
  setCards: (cards: SearchPost[]) => void;
  isLoading: boolean;
}

export const Filter = memo(
  ({ handleLoading, siteData, setCards, isLoading }: IFilter) => {
    const [selectedDateSince, setSelectedDateSince] = useState<Date | null>(
      null,
    );

    const [selectedUntilSince, setSelectedDateUntil] = useState<Date | null>(
      null,
    );

    const { values, submitForm, setFieldValue, handleChange, handleBlur } =
      useFormik({
        initialValues,
        onSubmit: async (values) => {
          handleLoading(true);

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
            const posts = await searchPosts(siteData.id, transformedObject);

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
            handleLoading(false);
          }
        },
      });

    const handleChangeAuthors = useCallback(
      (value: OptionAuthorType[]) => {
        setFieldValue("authors", value);
      },
      [setFieldValue],
    );

    const handleChangeHashtags = useCallback(
      (value: string[]) => {
        setFieldValue("hashtags", value);
      },
      [setFieldValue],
    );

    const handleChangeTypes = useCallback(
      (value: number[]) => {
        setFieldValue("kinds", value);
      },
      [setFieldValue],
    );

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

    return (
      <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body1" component="div">
            <b>Author</b>
          </Typography>
          <FormControl fullWidth>
            <AuthorFilter
              selectedAuthors={values.authors}
              handleChangeAuthors={handleChangeAuthors}
              contributors={
                siteData?.contributors ? siteData?.contributors : []
              }
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
              contributors={
                siteData?.contributors ? siteData?.contributors : []
              }
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
  },
);

Filter.displayName = "Filter";
