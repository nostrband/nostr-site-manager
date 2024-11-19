"use client";
import {
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
} from "@mui/material";

import {
  SpinerWrapSites,
  StyledEmptyBlock,
  StyledSearchField,
  StyledShowMore,
  StyledTitle,
  StyledWrapListSites,
} from "./styled";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { SpinerCircularProgress } from "@/components/Spiner";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { searchSites } from "@/services/nostr/api";
import { LoadingButton } from "@mui/lab";
import useResponsive from "@/hooks/useResponsive";
import { ListSites } from "./components/ListSites";
import { InputField } from "@/components/InputField";
import { NotFoundIcon, SearchIcon } from "@/components/Icons";
import { Header } from "@/components/Header";

// const debouncedSearchSites = debounce(async (text: string) => {
//   console.log("searching", text);
//   return await searchSites(text);
// }, 300);

export const Sites = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [isFetchSites, setFetchSites] = useState(false);
  const [data, setData] = useState<ReturnSettingsSiteDataType[] | undefined>();
  const [until, setUntil] = useState<number>(0);
  const isDesktop = useResponsive("up", "sm");
  const isShowMoreButton = Boolean(data && data.length);
  const isNotFound = data && !data.length && !isFetchSites;
  const isShowLoading = !data && isFetchSites;

  useEffect(() => {
    if (data === undefined) setFetchSites(true);
    searchSites("").then(([data, until]) => {
      setData(data);
      setUntil(until);
      setFetchSites(false);
    });
  }, []);

  const fetchSites = useCallback(
    debounce(
      async (text: string) => {
        console.log("searching", text);
        const [data, until] = await searchSites(text);
        setData(data);
        setUntil(until);
        setFetchSites(false);
      },
      300,
      { trailing: true },
    ),
    [setData, setUntil, setFetchSites],
  );

  const loadMore = useCallback(async () => {
    setFetchSites(true);
    console.log("more", value, until);
    const [newData, newUntil] = await searchSites(value, until);
    setData([...data!, ...newData]);
    setUntil(newUntil);
    setFetchSites(false);
  }, [setData, setUntil, data, until]);

  const handleChangeWithDebounce = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      setFetchSites(true);
      fetchSites(event.target.value);
    },
    [setValue, fetchSites],
  );

  useEffect(() => {
    if (isDesktop) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isDesktop]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <StyledTitle>Discover sites</StyledTitle>

        <StyledSearchField>
          <InputField
            id="search-site"
            fullWidth
            size={isDesktop ? "medium" : "small"}
            inputRef={inputRef}
            label="Search sites"
            onChange={handleChangeWithDebounce}
            value={value}
            color="success"
            startIcon={<SearchIcon />}
            endAdornment={
              isFetchSites ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
          />
        </StyledSearchField>

        {isNotFound && (
          <StyledEmptyBlock>
            <Alert
              icon={<NotFoundIcon fontSize="inherit" />}
              severity="warning"
            >
              <b>Sites not found</b>
            </Alert>
          </StyledEmptyBlock>
        )}

        {data && <StyledWrapListSites><ListSites data={data} /></StyledWrapListSites>}

        {isShowMoreButton && (
          <StyledShowMore
          >
            <LoadingButton
              onClick={loadMore}
              loading={!data || isFetchSites}
              variant="contained"
              color="decorate"
              fullWidth
              size="large"
            >
              More
            </LoadingButton>
          </StyledShowMore>
        )}
      </Container>

      {isShowLoading && (
        <SpinerWrapSites>
          <SpinerCircularProgress />
        </SpinerWrapSites>
      )}
    </>
  );
};
