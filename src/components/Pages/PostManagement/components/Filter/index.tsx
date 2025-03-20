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
  Dispatch,
  forwardRef,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
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
import {
  SearchPost,
  filterSitePosts,
  getSiteContributors,
} from "@/services/nostr/content";
import { LoadingButton } from "@mui/lab";
import { useRouter, useSearchParams } from "next/navigation";
import { TransitionProps } from "@mui/material/transitions";
import { DatePickerField } from "./components/DatePickerField";
import Link from "next/link";
import { nip19 } from "nostr-tools";
import { fetchProfiles } from "@/services/nostr/api";
import { ScrollTop } from "@/components/ScrollTop";

export interface FilterRef {
  handleLoadMore: (createdAtTime: number) => void;
}

type InputObject = {
  authors: string[];
  kinds: number[];
  hashtags: string[];
  since?: number;
  until?: number;
  search: string;
  loadMore?: boolean;
};

const initialValues: {
  authors: OptionAuthorType[];
  kinds: number[];
  hashtags: string[];
  since?: number;
  until?: number;
  search: string;
  loadMore?: boolean;
  loadMoreUntil: number;
} = {
  authors: [],
  kinds: [],
  hashtags: [],
  since: undefined,
  until: undefined,
  search: "",
  loadMore: false,
  loadMoreUntil: 0,
};

interface Props {
  window?: () => Window;
}

interface IFilter extends Props {
  handleLoading: (state: boolean) => void;
  handleLoadingMore: (state: boolean) => void;
  siteId: string;
  setPosts: Dispatch<SetStateAction<SearchPost[]>>;
  setIsEmpty: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  linkToAddPost: string;
}

const transformObject = (input: InputObject): Partial<InputObject> => {
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
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const FilterComponent = forwardRef<FilterRef, IFilter>(
  (
    {
      siteId,
      handleLoading,
      isLoading,
      setPosts,
      handleLoadingMore,
      setIsEmpty,
      linkToAddPost,
      ...props
    },
    ref,
  ) => {
    const [isOpenMoreFilter, setOpenMoreFilter] = useState(false);
    const isDesktop = useResponsive("up", "sm");
    const sizeField = isDesktop ? "medium" : "small";

    const [manualLoad, setManualLoad] = useState(false);

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

    const [selectedDateSince, setSelectedDateSince] = useState<Date | null>(
      null,
    );
    const [selectedUntilSince, setSelectedDateUntil] = useState<Date | null>(
      null,
    );

    const isLoadingFilter = isLoadingSetting || isFetching || isLoading;

    const getFilterSitePosts = async (
      formData: Partial<InputObject>,
      id: string,
      isLoadMore?: boolean,
    ) => {
      if (isLoadMore) {
        handleLoadingMore(true);

        try {
          const posts = await filterSitePosts(id, formData);

          setPosts((prev) => {
            const prevPosts = new Set(prev.map((item) => item.id));

            const newPosts = posts.filter((item) => !prevPosts.has(item.id));
            console.log({ postLength: newPosts.length });

            if (newPosts.length === 0) {
              setIsEmpty(true);
            } else {
              setIsEmpty(false);
            }

            return [...prev, ...newPosts];
          });
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
          handleLoadingMore(false);

          setFieldValue("loadMore", false);
        }
      } else {
        handleLoading(true);

        try {
          const posts = await filterSitePosts(id, formData);

          console.log({ posts, formData });

          if (posts.length === 0) {
            setIsEmpty(true);
          } else {
            setIsEmpty(false);
          }

          setPosts(posts);
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
      }
    };

    const { values, submitForm, setFieldValue, handleReset } = useFormik({
      initialValues,
      onSubmit: async (values) => {
        const isLoadMore = values.loadMore;

        const prepareData = {
          authors: values.authors.map((el) => el.pubkey),
          kinds: values.kinds,
          hashtags: values.hashtags.map((str) => str.slice(1)),
          since: values.since,
          until: values.until,
          search: values.search,
        };

        console.log({ values, prepareData });

        const transformedObject = transformObject(prepareData);

        if (isLoadMore) {
          if (siteData) {
            const loadMoreData = {
              ...transformedObject,
              until: values.loadMoreUntil,
            };

            await getFilterSitePosts(loadMoreData, siteData.id, isLoadMore);
          }
        } else {
          if (prepareData.kinds.length) {
            searchParams.set("kinds", prepareData.kinds.join(","));
          } else {
            searchParams.delete("kinds");
          }

          if (prepareData.until) {
            searchParams.set("until", (prepareData.until / 1000).toString());
          } else {
            searchParams.delete("until");
          }

          if (prepareData.since) {
            searchParams.set("since", (prepareData.since / 1000).toString());
          } else {
            searchParams.delete("since");
          }

          if (prepareData.search) {
            searchParams.set("search", prepareData.search.trim());
          } else {
            searchParams.delete("search");
          }

          if (prepareData.hashtags.length) {
            searchParams.set("hashtags", prepareData.hashtags.join(","));
          } else {
            searchParams.delete("hashtags");
          }

          if (prepareData.authors.length) {
            searchParams.set("authors", prepareData.authors.join(","));
          } else {
            searchParams.delete("authors");
          }

          setManualLoad(true);

          router.push(`?${searchParams.toString()}`);

          if (siteData) {
            await getFilterSitePosts(transformedObject, siteData.id);
          }
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

    const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valueSearch = e.target.value;

      setFieldValue("search", valueSearch);
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

    const handleLoadMore = (until: number) => {
      setFieldValue("loadMore", true);
      setFieldValue("loadMoreUntil", until);

      submitForm();
    };

    useImperativeHandle(ref, () => ({
      handleLoadMore,
    }));

    useEffect(() => {
      if (params.size === 0) {
        if (siteData) {
          submitForm();
        }
      }
    }, [submitForm, siteData, params]);

    useEffect(() => {
      if (!siteData) return;
      const load = async () => {
        const authors = params.get("authors")
          ? params.get("authors")!.split(",")
          : [];

        const contributors = await getSiteContributors(siteId);
        authors.push(...contributors);
        setContributors(authors);
      };
      load();
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
      } else {
        setFieldValue("authors", []);
      }

      const kinds = params.get("kinds")
        ? params.get("kinds")!.split(",").map(Number)
        : [];

      const hashtags = params.get("hashtags")
        ? params.get("hashtags")!.split(",")
        : [];

      const since = params.get("since")
        ? Number(params.get("since")) * 1000
        : undefined;

      const until = params.get("until")
        ? Number(params.get("until")) * 1000
        : undefined;

      const search = params.get("search") || "";

      if (since) {
        setSelectedDateSince(new Date(since));
      } else {
        setSelectedDateSince(null);
      }
      if (until) {
        setSelectedDateUntil(new Date(until));
      } else {
        setSelectedDateUntil(null);
      }

      setFieldValue("kinds", kinds);
      setFieldValue(
        "hashtags",
        hashtags.map((str) => `#${str}`),
      );
      setFieldValue("since", since);
      setFieldValue("until", until);
      setFieldValue("search", search);

      if (hashtags.length !== 0 || since || until) {
        setOpenMoreFilter(true);
      }

      const prepareData = {
        authors: authors.map((el) => el.pubkey),
        kinds: kinds,
        hashtags: hashtags.map((str) => str.slice(1)),
        since: since,
        until: until,
        search: search,
      };

      const transformedObject = transformObject(prepareData);

      if (siteData && !manualLoad) {
        getFilterSitePosts(transformedObject, siteData.id);
      }
    }, [siteData, params, manualLoad]);

    useEffect(() => {
      const handlePopState = () => {
        setManualLoad(false);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }, []);

    const renderFilterContent = (
      <StyledWrapFilter>
        <form
          onSubmit={(e) => {
            e.preventDefault();

            submitForm();
          }}
        >
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
            <Grid item xs={12} sm={4} lg={4}>
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
            <Grid item xs={12} sm={4} lg={4}>
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
            <Grid item xs={12} sm={4} lg={4}>
              <StyledFormControl fullWidth size={sizeField}>
                <StyledFormControlLabel htmlFor="search-content">
                  Search string
                </StyledFormControlLabel>
                <OutlinedInput
                  id="search-content"
                  fullWidth
                  label="Search string"
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
                <Grid item xs={12} sm={4} lg={4}>
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
                <Grid item xs={12} sm={4} lg={4}>
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
                <Grid item xs={12} sm={4} lg={4}>
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
              <Grid item xs={12} sm={4} lg={4}>
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
              <Grid item xs={12} sm={4} lg={4}>
                <LoadingButton
                  onClick={() => {
                    if (isDesktop) {
                      submitForm();
                    } else {
                      submitForm();
                      handleClose();
                    }
                  }}
                  type="submit"
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
                  {isDesktop ? "Filter" : "Save"}
                </LoadingButton>
              </Grid>
            </Grid>
          </StyledWrapField>
        </form>
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

        {!isDesktop && (
          <StyledActionsButtonWrap>
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

            <Button
              LinkComponent={Link}
              href={linkToAddPost}
              size="large"
              fullWidth
              color="decorate"
              variant="contained"
              endIcon={<PlusIcon fontSize="inherit" />}
            >
              Add post
            </Button>
          </StyledActionsButtonWrap>
        )}

        <ScrollTop position={isDesktop ? undefined : [76, 18]} {...props} />
      </>
    );
  },
);

FilterComponent.displayName = "FilterComponent";

export const Filter = memo(FilterComponent);
