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
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import { SpinerCircularProgress } from "@/components/Spiner";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { searchSites } from "@/services/nostr/api";
import { LoadingButton } from "@mui/lab";
import useResponsive from "@/hooks/useResponsive";
import { InputField } from "@/components/InputField";
import { NotFoundIcon, SearchIcon } from "@/components/Icons";
import { ListSites } from "@/components/ListSites";
import { HeaderDiscover } from "./components/Header";

export const Sites = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [isMoreButton, setIsMoreButton] = useState<boolean>(false);
  const [isFetchSites, setFetchSites] = useState(false);
  const [data, setData] = useState<ReturnSettingsSiteDataType[] | undefined>();
  const [until, setUntil] = useState<number>(0);
  const isNotFound = data && !data.length && !isFetchSites;
  const isShowLoading = !data && isFetchSites;

  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const fetchSites = useMemo(
    () =>
      debounce(
        async (text: string) => {
          console.log("searching", text);
          setFetchSites(true);
          const [data, until, isMore] = await searchSites(text);
          setIsMoreButton(isMore);
          setData(data);
          setUntil(until);
          setFetchSites(false);
        },
        300,
        { trailing: true },
      ),
    [],
  );

  useEffect(() => {
    return () => {
      fetchSites.cancel();
    };
  }, [fetchSites]);

  const handleChangeWithDebounce = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;
      setValue(text);
      fetchSites(text);
    },
    [fetchSites],
  );

  const loadMore = useCallback(async () => {
    setFetchSites(true);
    console.log("more", value, until);
    const [newData, newUntil, isMore] = await searchSites(value, until);
    setIsMoreButton(isMore);
    setData([...data!, ...newData]);
    setUntil(newUntil);
    setFetchSites(false);
  }, [setData, setUntil, data, until, value]);

  useEffect(() => {
    if (data === undefined) {
      setFetchSites(true);
      searchSites("").then(([data, until, isMore]) => {
        setIsMoreButton(isMore);
        setData(data);
        setUntil(until);
        setFetchSites(false);
      });
    }
  }, [data]);

  useEffect(() => {
    if (isDesktop && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDesktop]);

  return (
    <>
      <HeaderDiscover />
      <Container maxWidth="lg">
        <StyledTitle>Discover sites</StyledTitle>

        <StyledSearchField>
          <InputField
            id="search-site"
            fullWidth
            size={sizeField}
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

        {data && (
          <StyledWrapListSites>
            <ListSites data={data} />
          </StyledWrapListSites>
        )}

        {isMoreButton && (
          <StyledShowMore>
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
