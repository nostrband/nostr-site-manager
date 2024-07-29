"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { PreviewSite } from "@/components/PreviewSite";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
import ScreenSearchDesktopTwoToneIcon from "@mui/icons-material/ScreenSearchDesktopTwoTone";
import { SpinerWrapSites, StyledEmptyBlock, StyledEmptyIcon } from "./styled";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { SpinerCircularProgress } from "@/components/Spiner";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { searchSites } from "@/services/nostr/api";
import { LoadingButton } from "@mui/lab";

const debouncedSearchSites = debounce(async (text: string) => {
  console.log("searching", text);
  return await searchSites(text);
}, 300);

export const Sites = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>("");
  const [isFetchSites, setFetchSites] = useState(false);
  const [data, setData] = useState<ReturnSettingsSiteDataType[] | undefined>();
  const [until, setUntil] = useState<number>(0);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{ paddingBottom: "50px" }}>
      <HeaderOnboarding />
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: "center", margin: "40px 0" }} variant="h2">
          Discover sites
        </Typography>
        <Box sx={{ maxWidth: "600px", margin: "40px auto" }}>
          <OutlinedInput
            fullWidth
            inputRef={inputRef}
            placeholder="Search sites..."
            onChange={handleChangeWithDebounce}
            value={value}
            endAdornment={
              isFetchSites ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
          />
        </Box>
      </Container>

      {data && (
        <Container maxWidth="lg">
          <Grid
            sx={{ width: "100%", marginTop: "40px" }}
            container
            spacing={{ xs: "24px", md: "30px" }}
          >
            {data.map((el, i) => {
              return (
                <Grid key={i} item xs={12} sm={6} lg={4}>
                  <PreviewSite
                    id={el.id}
                    icon={el.adminAvatar || ""}
                    logo={el.logo}
                    name={el.name}
                    title={el.title}
                    url={el.url}
                    image={el.image}
                    description={el.description}
                    accentColor={el.accentColor}
                    contributors={el.contributors}
                    adminAvatar={el.adminAvatar}
                    adminName={el.adminName}
                    isPublic
                    isLinkToOpenSite={false}
                  />
                </Grid>
              );
            })}
          </Grid>

          <Box
            sx={{
              marginTop: "50px",
              marginBottom: "50px",
              textAlign: "center",
            }}
          >
            <LoadingButton
              onClick={loadMore}
              loading={!data || isFetchSites}
              variant="contained"
              color="decorate"
              sx={{ width: "280px", textAlign: "center" }}
            >
              More
            </LoadingButton>
          </Box>
        </Container>
      )}

      {!data && isFetchSites && (
        <SpinerWrapSites>
          <SpinerCircularProgress />
        </SpinerWrapSites>
      )}

      {data && !data.length && !isFetchSites && (
        <StyledEmptyBlock>
          <StyledEmptyIcon>
            <ScreenSearchDesktopTwoToneIcon fontSize="inherit" />
          </StyledEmptyIcon>
          <Typography variant="h4">Sites not found</Typography>
        </StyledEmptyBlock>
      )}
    </Box>
  );
};
