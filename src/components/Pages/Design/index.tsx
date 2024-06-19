"use client";
import { StyledPreviewTestSite } from "@/components/Pages/Preview/styled";
import Image, { StaticImageData } from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams, redirect } from "next/navigation";
import { THEMES_PREVIEW } from "@/consts";
import TuneIcon from "@mui/icons-material/Tune";
import {
  Fab,
  Drawer,
  Button,
  Select,
  Box,
  Tab,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import {
  StyledBottomActions,
  StyledButtonOpenSetting,
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledTitle,
  StyledWrapper,
  StyledImgPreview,
  StyledBannerPreview,
  StyledItemNavigation,
} from "@/components/Pages/Design/styled";
import { useFormik } from "formik";
import { validationSchemaMakePrivateSite } from "@/validations/rules";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { MuiColorInput } from "mui-color-input";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const initialDesignValue: {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  banner: string;
  logo: string;
  navigation: {
    primary: { title: string; link: string; id: string }[];
    secondary: { title: string; link: string; id: string }[];
  };
  hashtags: string[];
  kinds: string[];
  accentColor: string;
} = {
  id: "",
  name: "",
  shortName: "",
  description: "",
  icon: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  banner:
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  logo: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
  navigation: {
    primary: [],
    secondary: [],
  },
  hashtags: [],
  kinds: [],
  accentColor: "#ececec",
};

const hashtags = [
  "#cooking",
  "#photography",
  "#nostr",
  "#travel",
  "#grownostr",
];

const kinds = [  "short notes",
  "long notes",];

export const Design = () => {
  const params = useSearchParams();
  const themeId = params.get("themeId");
  const previewImg = THEMES_PREVIEW.find((el) => el.id === themeId);
  const [isOpenSettings, setOpenSettings] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
    submitForm().then();
  };

  const { values, submitForm, handleChange, setFieldValue, handleBlur } =
    useFormik({
      initialValues: initialDesignValue,
      validationSchema: validationSchemaMakePrivateSite,
      onSubmit: async (values) => {
        alert(JSON.stringify(values, null, 2));
      },
    });

  const handleChangeNavigation = (input: {
    id: string;
    type: "primary" | "secondary";
    field: "title" | "link";
    value: string;
  }) => {
    const navigation = values.navigation;

    const item = navigation[input.type].find((item) => item.id === input.id);

    if (item) {
      item[input.field] = input.value;
    }

    setFieldValue("navigation", navigation);
  };

  const handleAddLinkNavigation = (type: "primary" | "secondary") => {
    setFieldValue("navigation", {
      ...values.navigation,
      [type]: [
        ...values.navigation[type],
        { title: "", link: "", id: Date.now() },
      ],
    });
  };

  const handleRemoveLinkNavigation = (input: {
    id: string;
    type: "primary" | "secondary";
  }) => {
    const navigation = values.navigation;

    navigation[input.type] = navigation[input.type].filter(
      (item) => item.id !== input.id,
    );

    setFieldValue("navigation", navigation);
  };

  if (!themeId) {
    return redirect("/");
  }

  return (
    <>
      <StyledPreviewTestSite>
        <Image src={previewImg?.preview as StaticImageData} alt="test site" />
      </StyledPreviewTestSite>

      <StyledButtonOpenSetting
        onClick={handleOpenSettings}
        color="primary"
        aria-label="open"
      >
        <TuneIcon />
      </StyledButtonOpenSetting>

      <Drawer
        anchor="right"
        open={isOpenSettings}
        onClose={handleCloseSettings}
      >
        <StyledWrapper>
          <StyledTitle variant="h5">
            Settings
            <Fab
              onClick={handleCloseSettings}
              size="small"
              color="primary"
              aria-label="close"
            >
              <CloseIcon />
            </Fab>
          </StyledTitle>

          <StyledFormControl>
            <StyledLabel htmlFor="shortName">Short name</StyledLabel>
            <StyledTextField size="small" fullWidth id="shortName" />
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="name">Name</StyledLabel>
            <StyledTextField size="small" fullWidth id="name" />
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="name">Description</StyledLabel>
            <StyledTextField
              size="small"
              fullWidth
              id="description"
              multiline
              rows={4}
            />
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="image">Icon</StyledLabel>
            <StyledTextField
              size="small"
              id="icon"
              name="icon"
              fullWidth
              onChange={handleChange}
              value={values.icon}
              onBlur={handleBlur}
            />
            <StyledImgPreview>
              <img alt="Icon url" src={values.icon} />
            </StyledImgPreview>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="logo">Logo</StyledLabel>
            <StyledTextField
              size="small"
              id="logo"
              name="logo"
              fullWidth
              onChange={handleChange}
              value={values.logo}
              onBlur={handleBlur}
            />
            <StyledImgPreview>
              <img alt="Logo url" src={values.icon} />
            </StyledImgPreview>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="banner">Banner</StyledLabel>
            <StyledTextField
              size="small"
              id="banner"
              name="banner"
              fullWidth
              onChange={handleChange}
              value={values.banner}
              onBlur={handleBlur}
            />
            <StyledBannerPreview>
              <img alt="Banner url" src={values.banner} />
            </StyledBannerPreview>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel>Accent color</StyledLabel>
            <MuiColorInput
              fullWidth
              format="hex"
              value={values.accentColor}
              onChange={(value) => setFieldValue("accentColor", value)}
            />
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="hashtags">Hashtags</StyledLabel>
            <Select
              id="hashtags"
              multiple
              size="small"
              value={values.hashtags}
              onChange={(e) => setFieldValue("hashtags", e.target.value)}
              sx={{
                height: "42px",
              }}
              renderValue={(selected) => {
                return selected.join(", ");
              }}
              displayEmpty
            >
              {hashtags.map((hashtag) => (
                <MenuItem key={hashtag} value={hashtag}>
                  <Checkbox
                    color="decorate"
                    checked={values.hashtags.indexOf(hashtag) > -1}
                  />
                  <ListItemText primary={hashtag} />
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel htmlFor="kinds">Kinds</StyledLabel>
            <Select
              id="kinds"
              multiple
              size="small"
              value={values.kinds}
              onChange={(e) => setFieldValue("kinds", e.target.value)}
              sx={{
                height: "42px",
              }}
              renderValue={(selected) => {
                return selected.join(", ");
              }}
              displayEmpty
            >
              {kinds.map((kind) => (
                <MenuItem key={kind} value={kind}>
                  <Checkbox
                    color="decorate"
                    checked={values.kinds.indexOf(kind) > -1}
                  />
                  <ListItemText primary={kind} />
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel>Navigation</StyledLabel>
            <TabContext value={activeTab}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={(_, value) => setActiveTab(value)}>
                  <Tab label="Primary" value="1" />
                  <Tab label="Secondary" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                {values.navigation &&
                  values.navigation.primary.map((el) => {
                    return (
                      <StyledItemNavigation key={el.id}>
                        <FormControl fullWidth size="small">
                          <InputLabel htmlFor="title">Title link</InputLabel>
                          <OutlinedInput
                            id="title"
                            name="title"
                            label="Title link"
                            onChange={(e) =>
                              handleChangeNavigation({
                                id: el.id,
                                field: "title",
                                type: "primary",
                                value: e.target.value,
                              })
                            }
                            value={el.title}
                          />
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel htmlFor="link">Link</InputLabel>
                          <OutlinedInput
                            id="link"
                            name="link"
                            label="Link"
                            onChange={(e) =>
                              handleChangeNavigation({
                                id: el.id,
                                field: "link",
                                type: "primary",
                                value: e.target.value,
                              })
                            }
                            value={el.link}
                          />
                        </FormControl>

                        <Button
                          variant="contained"
                          fullWidth
                          color="error"
                          onClick={() =>
                            handleRemoveLinkNavigation({
                              id: el.id,
                              type: "primary",
                            })
                          }
                        >
                          Remove
                        </Button>
                      </StyledItemNavigation>
                    );
                  })}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddLinkNavigation("primary")}
                >
                  Add
                </Button>
              </TabPanel>
              <TabPanel value="2">
                {values.navigation &&
                  values.navigation.secondary.map((el) => {
                    return (
                      <StyledItemNavigation key={el.id}>
                        <FormControl fullWidth size="small">
                          <InputLabel htmlFor="title">Title link</InputLabel>
                          <OutlinedInput
                            id="title"
                            name="title"
                            label="Title link"
                            onChange={(e) =>
                              handleChangeNavigation({
                                id: el.id,
                                field: "title",
                                type: "secondary",
                                value: e.target.value,
                              })
                            }
                            value={el.title}
                          />
                        </FormControl>
                        <FormControl fullWidth size="small">
                          <InputLabel htmlFor="link">Link</InputLabel>
                          <OutlinedInput
                            id="link"
                            name="link"
                            label="Link"
                            onChange={(e) =>
                              handleChangeNavigation({
                                id: el.id,
                                field: "link",
                                type: "secondary",
                                value: e.target.value,
                              })
                            }
                            value={el.link}
                          />
                        </FormControl>

                        <Button
                          variant="contained"
                          fullWidth
                          color="error"
                          onClick={() =>
                            handleRemoveLinkNavigation({
                              id: el.id,
                              type: "secondary",
                            })
                          }
                        >
                          Remove
                        </Button>
                      </StyledItemNavigation>
                    );
                  })}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleAddLinkNavigation("secondary")}
                >
                  Add
                </Button>
              </TabPanel>
            </TabContext>
          </StyledFormControl>
        </StyledWrapper>
        <StyledBottomActions>
          <Button
            onClick={handleCloseSettings}
            variant="contained"
            fullWidth
            size="medium"
            color="darkInfo"
          >
            Switch theme
          </Button>
          <Button
            onClick={handleCloseSettings}
            variant="contained"
            fullWidth
            size="medium"
            color="decorate"
          >
            Save
          </Button>
        </StyledBottomActions>
      </Drawer>
    </>
  );
};
