"use client";
import {
  StyledActionsButtonWrap,
  StyledCloseFilterButton,
  StyledCollapseButtonFilter,
  StyledDialogContent,
  StyledFormControl,
  StyledFormControlLabel,
  StyledTitleFilter,
  StyledWrapField,
  StyledWrapFilter,
} from "./styled";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  CrossIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
} from "@/components/Icons";
import useResponsive from "@/hooks/useResponsive";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import {
  Button,
  Collapse,
  Dialog,
  Grid,
  OutlinedInput,
  Slide,
} from "@mui/material";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useFormik } from "formik";
import { AuthorFilter, OptionAuthorType } from "./components/Author";
import { enqueueSnackbar } from "notistack";
import { TypesFilter } from "./components/Types";
import { HashtagsFilter } from "./components/Hashtags";
import { SearchPost, searchPosts } from "@/services/nostr/content";
import { LoadingButton } from "@mui/lab";
import { useRouter, useSearchParams } from "next/navigation";
import { nip19 } from "nostr-tools";
import { fetchProfiles } from "@/services/nostr/api";
import { debounce } from "lodash";
import { TransitionProps } from "@mui/material/transitions";
import { pickersDayClasses } from "@mui/x-date-pickers/PickersDay/pickersDayClasses";
import { DatePickerField } from "./components/DatePickerField";

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
  setPosts: (cards: SearchPost[]) => void;
  isLoading: boolean;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export const Filter = memo(
  ({ siteId, handleLoading, isLoading, setPosts }: IFilter) => {
    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);
    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

    const router = useRouter();
    const params = useSearchParams();
    const searchParams = useMemo(
      () => new URLSearchParams(params.toString()),
      [params],
    );

    const [isOpenModal, setOpenModal] = useState(false);

    const handleClickOpen = () => {
      setOpenModal(true);
    };

    const handleClose = () => {
      setOpenModal(false);
    };

    const handleToggleMoreFilter = () => {
      setOpenMoreFilter((prev) => !prev);
    };

    const textToggleMoreFilter = isOpenMoreFilter ? "Hide" : "Show";

    const {
      data: siteData,
      isLoading: isLoadingSetting,
      isFetching,
    } = useSettingsSite(siteId);

    const [contributors, setContributors] = useState<string[]>([]);

    // const contributors = [...(siteData?.contributors ? siteData?.contributors : []), ...values.authors.map((el) => (el.pubkey) )]

    const [selectedDateSince, setSelectedDateSince] = useState<Date | null>(
      null,
    );
    const [selectedUntilSince, setSelectedDateUntil] = useState<Date | null>(
      null,
    );

    const isLoadingFilter = isLoadingSetting || isFetching || isLoading;

    const { values, submitForm, setFieldValue, handleReset } = useFormik({
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
          if (siteData) {
            const posts = await searchPosts(siteData.id, transformedObject);

            console.log({ posts, transformedObject });

            setPosts(posts);
          }
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

        console.log({ value });

        if (value.length) {
          searchParams.set("authors", value.map((el) => el.pubkey).join(","));
        } else {
          searchParams.delete("authors");
        }

        router.push(`?${searchParams.toString()}`);
      },
      [setFieldValue, searchParams, router],
    );

    const handleChangeHashtags = useCallback(
      (value: string[]) => {
        setFieldValue("hashtags", value);

        if (value.length) {
          searchParams.set("hashtags", value.join(","));
        } else {
          searchParams.delete("hashtags");
        }

        router.push(`?${searchParams.toString()}`);
      },
      [setFieldValue, searchParams, router],
    );

    const handleChangeTypes = useCallback(
      (value: number[]) => {
        setFieldValue("kinds", value);

        if (value.length) {
          searchParams.set("kinds", value.join(","));
        } else {
          searchParams.delete("kinds");
        }

        router.push(`?${searchParams.toString()}`);
      },
      [setFieldValue, searchParams, router],
    );

    const handleDateSinceChange = (newValue: Date | null) => {
      setSelectedDateSince(newValue);

      if (newValue) {
        setFieldValue("since", newValue.getTime());

        searchParams.set("since", (newValue.getTime() / 1000).toString());
      } else {
        setFieldValue("since", undefined);

        searchParams.delete("since");
      }

      router.push(`?${searchParams.toString()}`);
    };

    const handleDateUntilChange = (newValue: Date | null) => {
      setSelectedDateUntil(newValue);

      if (newValue) {
        setFieldValue("until", newValue.getTime());

        searchParams.set("until", (newValue.getTime() / 1000).toString());
      } else {
        setFieldValue("until", undefined);

        searchParams.delete("until");
      }

      router.push(`?${searchParams.toString()}`);
    };

    const handleChangeSearchContentQueryParams = useMemo(
      () =>
        debounce((valueSearch: string) => {
          if (valueSearch) {
            searchParams.set("search", valueSearch);
          } else {
            searchParams.delete("search");
          }

          router.push(`?${searchParams.toString()}`);
        }, 100),
      [router, searchParams],
    );

    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueSearch = e.target.value;

      setFieldValue("search", valueSearch);

      handleChangeSearchContentQueryParams(valueSearch.trim());
    };

    const handleClearFilter = () => {
      handleReset(undefined);
      setSelectedDateSince(null);
      setSelectedDateUntil(null);

      const searchParamsReset = new URLSearchParams("");

      router.push(`?${searchParamsReset.toString()}`);
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
        submitForm();
      }
    }, [submitForm, siteData]);

    useEffect(() => {
      if (siteData) {
        const authors = params.get("authors")
          ? params.get("authors")!.split(",")
          : [];

        if (authors.length) {
          const mergeContributors = [
            ...authors,
            ...siteData.contributors,
          ].filter(
            (author, index, self) =>
              index === self.findIndex((a) => a === author),
          );

          setContributors(mergeContributors);
        } else {
          setContributors(siteData.contributors);
        }
      }
    }, [siteData]);

    useEffect(() => {
      const authors = params.get("authors")
        ? params
            .get("authors")!
            .split(",")
            .map((pubkey) => ({ pubkey }))
        : [];

      if (authors.length) {
        fetchProfiles(authors.map((el) => el.pubkey))
          .then((profiles) => {
            if (profiles.length) {
              const dataAuthors = profiles.map((author) => {
                let meta;

                try {
                  meta = JSON.parse(author.content);
                } catch (error) {
                  console.error("Error parsing author content:", error);
                  meta = {};
                }

                const npub = author.pubkey
                  ? nip19.npubEncode(author.pubkey).substring(0, 8) + "..."
                  : "";
                const name = meta.display_name || meta.name || npub;
                const img = meta.picture || "";

                return {
                  img,
                  title: name,
                  id: author.id,
                  pubkey: author.pubkey,
                };
              });

              setFieldValue("authors", dataAuthors);
            } else {
              setFieldValue("authors", []);
            }
          })
          .catch((error) => {
            console.error("Error fetching profiles:", error);

            setFieldValue("authors", []);
          });
      }

      const kinds = params.get("kinds")
        ? params.get("kinds")!.split(",").map(Number)
        : [];

      setFieldValue("kinds", kinds);

      const hashtags = params.get("hashtags")
        ? params.get("hashtags")!.split(",")
        : [];

      setFieldValue("hashtags", hashtags);

      const since = params.get("since")
        ? Number(params.get("since")) * 1000
        : undefined;

      setFieldValue("since", since);

      const until = params.get("until")
        ? Number(params.get("until")) * 1000
        : undefined;

      setFieldValue("until", until);

      const search = params.get("search") || "";

      setFieldValue("search", search);

      if (kinds.length !== 0 || hashtags.length !== 0 || since || until) {
        setOpenMoreFilter(true);
      }

      if (since) setSelectedDateSince(new Date(since));
      if (until) setSelectedDateUntil(new Date(until));
    }, []);

    const renderFilterContent = (
      <StyledWrapFilter>
        <StyledTitleFilter>
          <StyledCloseFilterButton
            onClick={handleClose}
            color="primary"
            variant="text"
          >
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

        <Grid container spacing={{ xs: "24px", sm: "16px" }}>
          <Grid item xs={12} sm={6}>
            <StyledFormControl fullWidth>
              <AuthorFilter
                label="Author"
                id="author"
                size={sizeField}
                selectedAuthors={values.authors}
                handleChangeAuthors={handleChangeAuthors}
                contributors={contributors}
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
                onChange={onSearchInputChange}
                value={values.search}
                name="search"
              />
            </StyledFormControl>
          </Grid>
        </Grid>

        <Collapse in={isDesktop ? isOpenMoreFilter : true}>
          <StyledWrapField>
            <Grid container spacing={{ xs: "24px", sm: "16px" }}>
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
                    size={sizeField}
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
                    <DatePickerField
                      label="Since"
                      value={selectedDateSince}
                      onChange={handleDateSinceChange}
                      sizeField={sizeField}
                    />
                  </LocalizationProvider>
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <StyledFormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePickerField
                      label="Until"
                      value={selectedUntilSince}
                      onChange={handleDateUntilChange}
                      sizeField={sizeField}
                    />
                  </LocalizationProvider>
                </StyledFormControl>
              </Grid>
            </Grid>
          </StyledWrapField>
        </Collapse>

        <StyledWrapField>
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
                fullWidth={!isDesktop}
                color="secondary"
                size="large"
              >
                Clear all
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <LoadingButton
                onClick={() => {
                  if (isDesktop) {
                    submitForm();
                  } else {
                    submitForm();
                    handleClose();
                  }
                }}
                disabled={isLoadingFilter}
                loading={isLoadingFilter}
                variant="contained"
                fullWidth
                color="decorate"
                size="large"
                endIcon={
                  !isDesktop ? <CheckIcon fontSize="inherit" /> : undefined
                }
              >
                {isDesktop ? "Accept" : "Save"}
              </LoadingButton>
            </Grid>
          </Grid>
        </StyledWrapField>
      </StyledWrapFilter>
    );

    return (
      <>
        {isDesktop ? (
          renderFilterContent
        ) : (
          <Dialog
            style={{ zIndex: 1298 }}
            fullScreen
            open={isOpenModal}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
            <StyledDialogContent>{renderFilterContent}</StyledDialogContent>
          </Dialog>
        )}

        <StyledActionsButtonWrap>
          {!isDesktop && (
            <Button
              onClick={handleClickOpen}
              size="large"
              fullWidth
              color="decorate"
              variant="outlined"
              startIcon={<FilterIcon fontSize="inherit" />}
            >
              Filter
            </Button>
          )}
          <Button
            size="large"
            fullWidth
            color="decorate"
            variant="contained"
            endIcon={<PlusIcon fontSize="inherit" />}
          >
            Add post
          </Button>
        </StyledActionsButtonWrap>
      </>
    );
  },
);

Filter.displayName = "Filter";
