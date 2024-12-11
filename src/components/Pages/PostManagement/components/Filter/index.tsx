"use client";
import {
  StyledCloseFilterButton,
  StyledCollapseButtonFilter,
  StyledFormControl,
  StyledFormControlLabel,
  StyledTitleFilter,
  StyledWrapFilter,
} from "./styled";
import {
  CalendarIcon,
  ChevronLeftIcon,
  CrossIcon,
  SearchIcon,
} from "@/components/Icons";
import useResponsive from "@/hooks/useResponsive";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { Box, Button, Collapse, Grid, OutlinedInput } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import { AuthorFilter, OptionAuthorType } from "./components/Author";
import { enqueueSnackbar } from "notistack";
import { TypesFilter } from "./components/Types";
import { HashtagsFilter } from "./components/Hashtags";

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
  siteId: string;
  // @ts-ignore
  setPosts: (cards: SearchPost[]) => void;
  isLoading: boolean;
}

export const Filter = ({
  siteId,
  handleLoading,
  isLoading,
  setPosts,
}: IFilter) => {
  const [isOpenMoreFilter, setOpenMoreFilter] = useState(true);
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const handleToggleMoreFilter = () => {
    setOpenMoreFilter((prev) => !prev);
  };

  const textToggleMoreFilter = isOpenMoreFilter ? "Hide" : "Show";

  const {
    data: siteData,
    isLoading: isLoadingSetting,
    isFetching,
  } = useSettingsSite(siteId);

  const [selectedDateSince, setSelectedDateSince] = useState<Date | null>(null);
  const [selectedUntilSince, setSelectedDateUntil] = useState<Date | null>(
    null
  );

  const isLoadingFilter = (isLoadingSetting || isFetching) || isLoading

  const {
    values,
    submitForm,
    setFieldValue,
    handleChange,
    handleBlur,
    handleReset,
  } = useFormik({
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
        //   const posts = await searchPosts(siteData.id, transformedObject);

        //   console.log({ posts, transformedObject });
        setPosts([]); // posts
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
    [setFieldValue]
  );

  const handleChangeHashtags = useCallback(
    (value: string[]) => {
      setFieldValue("hashtags", value);
    },
    [setFieldValue]
  );

  const handleChangeTypes = useCallback(
    (value: number[]) => {
      setFieldValue("kinds", value);
    },
    [setFieldValue]
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

  const handleClearFilter = () => {
    handleReset(undefined);
    setSelectedDateSince(null);
    setSelectedDateUntil(null);
  };

  const isValuesEmpty = useCallback(() => {
    return (
      values.authors.length === 0 &&
      values.kinds.length === 0 &&
      values.hashtags.length === 0 &&
      !values.since &&
      !values.until &&
      values.search.trim() === ""
    );
  }, [values]);

  useEffect(() => {
    if (siteData) {
        submitForm()
    }
  }, [submitForm, siteData])

  return (
    <StyledWrapFilter>
      <StyledTitleFilter>
        <StyledCloseFilterButton color="primary" variant="text">
          <ChevronLeftIcon />
        </StyledCloseFilterButton>
        Filter
        <StyledCollapseButtonFilter
          color="decorate"
          isOpenMoreFilter={isOpenMoreFilter}
          variant="text"
          endIcon={
            <ChevronLeftIcon
              className="collapseButtonIcon"
              fontSize="inherit"
            />
          }
          onClick={handleToggleMoreFilter}
        >
          {textToggleMoreFilter} filters
        </StyledCollapseButtonFilter>
      </StyledTitleFilter>

      <Grid container spacing={{ xs: "16px" }}>
        <Grid item xs={12} sm={6}>
          <StyledFormControl fullWidth size={sizeField}>
            <AuthorFilter
              label="Author"
              id="author"
              selectedAuthors={values.authors}
              handleChangeAuthors={handleChangeAuthors}
              contributors={
                siteData?.contributors ? siteData?.contributors : []
              }
            />
          </StyledFormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <StyledFormControl fullWidth size={sizeField}>
            <StyledFormControlLabel htmlFor="search-content">
              Search content
            </StyledFormControlLabel>
            <OutlinedInput
              id="search-content"
              fullWidth
              label="Search content"
              endAdornment={<SearchIcon color="inherit" />}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.search}
              name="search"
            />
          </StyledFormControl>
        </Grid>
      </Grid>

      <Collapse in={isDesktop ? isOpenMoreFilter : true}>
        <Box sx={{ paddingTop: "16px" }}>
          <Grid container spacing={{ xs: "16px" }}>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledFormControl fullWidth size={sizeField}>
                <StyledFormControlLabel htmlFor="kinds-select">
                  Kinds
                </StyledFormControlLabel>
                <TypesFilter
                  label="Kinds"
                  id="kinds-select"
                  selectedTypes={values.kinds}
                  handleChangeTypes={handleChangeTypes}
                />
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledFormControl fullWidth>
                <HashtagsFilter
                  label="Hashtags"
                  contributors={
                    siteData?.contributors ? siteData?.contributors : []
                  }
                  selectedHashtags={values.hashtags}
                  handleChangeHashtags={handleChangeHashtags}
                />
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledFormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Since"
                    value={selectedDateSince}
                    onChange={handleDateSinceChange}
                    slots={{
                      openPickerIcon: CalendarIcon,
                    }}
                    slotProps={{
                      openPickerButton: {
                        sx: { color: "#666666" },
                      },
                    }}
                  />
                </LocalizationProvider>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <StyledFormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Until"
                    value={selectedUntilSince}
                    onChange={handleDateUntilChange}
                    slots={{
                      openPickerIcon: CalendarIcon,
                    }}
                    slotProps={{
                      openPickerButton: {
                        sx: { color: "#666666" },
                      },
                    }}
                  />
                </LocalizationProvider>
              </StyledFormControl>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Box sx={{ paddingTop: "16px" }}>
        <Grid
          spacing={{ xs: "16px" }}
          container
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Grid item xs={12} sm={6} lg={3}>
            <Button
              onClick={handleClearFilter}
              startIcon={<CrossIcon fontSize="inherit" />}
              disabled={isValuesEmpty()}
              variant="text"
              color="secondary"
              size="large"
            >
              Clear all
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <Button onClick={submitForm} disabled={isLoadingFilter} variant="contained" fullWidth color="decorate" size="large">
              Accept
            </Button>
          </Grid>
        </Grid>
      </Box>
    </StyledWrapFilter>
  );
};
