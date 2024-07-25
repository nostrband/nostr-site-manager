"use client";
import { HeaderOnboarding } from "@/components/HeaderOnboarding";
import { PreviewSite } from "@/components/PreviewSite";
import { useListSites } from "@/hooks/useListSites";
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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { SpinerCircularProgress } from "@/components/Spiner";

export const Sites = () => {
  const { data: testData, isFetching, isLoading } = useListSites(); // TODO: for test data, remove
  const mockData = testData ? [...testData, ...testData, ...testData] : [];

  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string | null>(null);
  const [isFetchSites, setFetchSites] = useState(false);
  const data = mockData;

  const fetchSites = debounce(async (newUrl: string) => {
    setFetchSites(true);

    setTimeout(() => {
      setFetchSites(false);
    }, 1000);
  }, 500);

  const handleChangeWithDebounce = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setValue(value);
    fetchSites(value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{paddingBottom: '50px'}}>
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

      {isLoading || isFetching || isFetchSites ? (
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
                    icon={el.icon}
                    logo={el.logo}
                    name={el.name}
                    title={el.title}
                    url={el.url}
                    image={el.image}
                    description={el.description}
                    accentColor={el.accentColor}
                    contributors={el.contributors}
                    isPublick
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
            <Typography variant="h2">Sites not found</Typography>
          </StyledEmptyBlock>
        )}
      </Container>
      )}

    </Box>
  );
};
