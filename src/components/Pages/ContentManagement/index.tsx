"use client";

import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
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
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TitleAdmin } from "@/components/TitleAdmin";
import { AvatarContributor, GroupContributors, TitleSection } from "./styled";
import { searchEvents } from "@/services/nostr/content";
import { useParams } from "next/navigation";

const filter = createFilterOptions();

const hashtags = [
  { title: "Hashtag 1" },
  { title: "Hashtag 2" },
  { title: "Hashtag 3" },
  { title: "Hashtag 4" },
  { title: "Hashtag 5" },
  { title: "Hashtag 6" },
];

const sampleCards = [
  {
    title: "Card 1",
    description: "This is the description for Card 1.",
    type: "manual-submitted",
    datetime: "2024-10-01",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Hashtag 1", "Hashtag 2"],
    url: "https://example.com/card1",
  },
  {
    title: "Card 2",
    description: "This is the description for Card 2.",
    type: "auto-submitted",
    datetime: "2024-10-02",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Hashtag 3"],
    url: "https://example.com/card2",
  },
  {
    title: "Card 3",
    description: "This is the description for Card 3.",
    type: "manual-submitted",
    datetime: "2024-10-03",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Nature", "Outdoors"],
    url: "https://example.com/card3",
  },
  {
    title: "Card 4",
    description: "This is the description for Card 4.",
    type: "auto-submitted",
    datetime: "2024-10-04",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Forest", "Adventure"],
    url: "https://example.com/card4",
  },
  {
    title: "Card 5",
    description: "This is the description for Card 5.",
    type: "manual-submitted",
    datetime: "2024-10-05",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Mountain", "Scenery"],
    url: "https://example.com/card5",
  },
  {
    title: "Card 6",
    description: "This is the description for Card 6.",
    type: "auto-submitted",
    datetime: "2024-10-06",
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    hashtags: ["Beach", "Relaxation"],
    url: "https://example.com/card6",
  },
];

export const ContentManagement = () => {
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [isOpenContributor, setOpenContributor] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpenAuthor = Boolean(anchorEl);
  const [value, setValue] = useState(null);
  const [age, setAge] = useState("");
  const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAge(event.target.value as string);
  };

  const handleOpenAuthor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAuthor = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpenContributor(true);
  };

  const handleClose = () => {
    setOpenContributor(false);
  };

  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  const handleCloseFilterDialog = () => {
    setFilterDialogOpen(false);
  };

  const test = async () => {
    const posts = await searchEvents(siteId, {
      hashtags: ["travel"],
      kinds: [1],
      authors: ["7d33ba57d8a6e8869a1f1d5215254597594ac0dbfeb01b690def8c461b82db35"],
    })
    console.log("found", posts);
  };

  const FilterContent = () => (
    <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <Typography variant="body1" component="div">
            <b>Author</b>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleOpenAuthor}
            sx={{ height: "56px" }}
          >
            Some author
          </Button>
        </FormControl>
        <Menu
          id="basic-menu"
          open={isOpenAuthor}
          anchorEl={anchorEl}
          onClose={handleCloseAuthor}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {/* MenuItems */}
        </Menu>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Types</b>
          </Typography>
          <Select value={age} onChange={handleChange} size="medium">
            <MenuItem value={10}>notes</MenuItem>
            <MenuItem value={20}>long-form</MenuItem>
            <MenuItem value={30}>pages</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <Typography variant="body1" component="div">
            <b>From</b>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker />
          </LocalizationProvider>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="small">
          <Typography variant="body1" component="div">
            <b>To</b>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker />
          </LocalizationProvider>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Hashtags</b>
          </Typography>
          <Autocomplete
            fullWidth
            value={value}
            onChange={(event, newValue) => {
              if (typeof newValue === "string") {
                setValue({
                  title: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setValue({
                  title: newValue.inputValue,
                });
              } else {
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option.title,
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  inputValue,
                  title: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={hashtags}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.title;
            }}
            renderOption={(props, option) => <li {...props}>{option.title}</li>}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                size="medium"
                placeholder="Choice hashtags"
              />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth size="medium">
          <Typography variant="body1" component="div">
            <b>Search</b>
          </Typography>
          <TextField size="medium" placeholder="Some text" />
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
            sx={{ height: "56px" }}
            onClick={test}
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

      <TitleSection variant="h5">Contributors</TitleSection>
      <GroupContributors>
        {Array.from({ length: 7 }).map((_, index) => (
          <Tooltip key={index} title="Some name" arrow>
            <AvatarContributor
              onClick={handleClickOpen}
              src="https://image.nostr.build/535960683182e3284dd54b97bf180266e59ffe1c6a33c64c3e9fcadcb61d94f9.png"
              variant="rounded"
            />
          </Tooltip>
        ))}
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
          {sampleCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={card.image}
                  alt={card.title}
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
                    {card.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.datetime}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {card.type === "auto-submitted"
                      ? "Auto-submitted"
                      : "Manual-submitted"}
                  </Typography>
                  <Box mt={1}>
                    {card.hashtags.map((tag, idx) => (
                      <Chip
                        label={tag}
                        key={idx}
                        size="small"
                        sx={{ marginRight: 0.5, backgroundColor: "#e0e0e0" }} // Установите фон для чипов
                      />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    href={card.url}
                    target="_blank"
                  >
                    Submit
                  </Button>
                  <Button size="small" variant="outlined" color="error">
                    Delete
                  </Button>
                  <Button size="small">
                    <MoreVertIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog onClose={handleClose} open={isOpenContributor}>
        <DialogTitle>Some information</DialogTitle>
      </Dialog>
    </>
  );
};
