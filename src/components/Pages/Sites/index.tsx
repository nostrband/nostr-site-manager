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
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { SpinerCircularProgress } from "@/components/Spiner";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { searchSites } from "@/services/nostr/api";

export const Sites = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>('');
  const [isFetchSites, setFetchSites] = useState(false);
  const [data, setData] = useState<ReturnSettingsSiteDataType[]>([]);

  useEffect(() => {
    if (!data.length) fetchSites("");
  }, []);

  const fetchSites = debounce(async (text: string) => {
    setFetchSites(true);
    console.log("searching", text);
    setData(await searchSites(text));
    setFetchSites(false);
  }, 1000);

  const handleChangeWithDebounce = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    fetchSites(event.target.value);
  };

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
          Sites
        </Typography>
        <Box sx={{ maxWidth: "600px", margin: "40px auto" }}>
          <OutlinedInput
            fullWidth
            inputRef={inputRef}
            placeholder="Some site name..."
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

      {isFetchSites ? (
        <SpinerWrapSites>
          <SpinerCircularProgress />
        </SpinerWrapSites>
      ) : (
        <Container maxWidth="lg">
          {data.length ? (
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
          ) : (
            <StyledEmptyBlock>
              <StyledEmptyIcon>
                <ScreenSearchDesktopTwoToneIcon fontSize="inherit" />
              </StyledEmptyIcon>
              <Typography variant="h4">Sites not found</Typography>
            </StyledEmptyBlock>
          )}
        </Container>
      )}
    </Box>
  );
};
