"use client";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import TuneIcon from "@mui/icons-material/Tune";
import { Fab, Drawer, Button, Box, Tab } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyledPreviewTestSite,
  StyledBottomActions,
  StyledButtonOpenSetting,
  StyledFormControl,
  StyledLabel,
  StyledTextField,
  StyledTitle,
  StyledWrapper,
  StyledImgPreview,
  StyledBannerPreview,
} from "@/components/Pages/Design/styled";
import InsertPhotoTwoToneIcon from "@mui/icons-material/InsertPhotoTwoTone";
import { useFormik } from "formik";
// import { validationSchemaMakePrivateSite } from "@/validations/rules";
import { MuiColorInput } from "mui-color-input";
import { AuthContext } from "@/services/nostr/nostr";
import {
  getPreviewSiteInfo,
  getPreviewSiteThemeCustomSettings,
  getPreviewThemeName,
  renderPreview,
  setPreviewSettings,
  startPreviewPublish,
  updatePreviewSite,
} from "@/services/nostr/themes";
import { SpinerWrap } from "@/components/Spiner";
import { SpinnerCustom } from "@/components/SpinnerCustom";
import { useSnackbar } from "notistack";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { CustomConfigType } from "./types";
import { generateFormFields } from "./utils";
import { Mutex } from "@/services/nostr/utils";

interface DesignValues {
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
  accentColor: string;
  custom: { [key: string]: string };
}

const initialDesignValue: DesignValues = {
  name: "",
  shortName: "",
  description: "",
  icon: "",
  banner: "",
  logo: "",
  navigation: {
    primary: [],
    secondary: [],
  },
  accentColor: "#ececec",
  custom: {},
};

const mutex = new Mutex();

let mounted = false;

const Design = () => {
  const router = useRouter();
  const { isAuth } = useContext(AuthContext);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const params = useSearchParams();
  const siteId = params.get("siteId");
  const themeId = params.get("themeId");
  // const theme = THEMES_PREVIEW.find((el) => el.id === themeId);
  // const previewImg = THEMES_PREVIEW.find((el) => el.id === themeId);
  const [isOpenSettings, setOpenSettings] = useState(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState("site");
  const [customConfig, setCustomConfig] = React.useState<CustomConfigType>({});
  const [isErrorLoadImage, setErrorLoadImage] = useState(false);

  const handleChangeActiveTab = (_: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleOpenSettings = useCallback(() => {
    setOpenSettings(true);
  }, [setOpenSettings]);

  const handlePublish = useCallback(async () => {
    setOpenSettings(false);
    startPreviewPublish();
    router.push(`/publishing?themeId=${themeId}&siteId=${siteId}`);
  }, [setOpenSettings, router]);

  const onSubmit = useCallback(
    async (values: DesignValues) => {
      await mutex.run(async () => {
        const start = Date.now();
        console.log("submit values", values);
        setLoading(true);
        try {
          const updated = await updatePreviewSite({
            accent_color: values.accentColor,
            name: values.shortName,
            cover_image: values.banner,
            description: values.description,
            icon: values.icon,
            logo: values.logo,
            title: values.name,
            navigation: values.navigation.primary.map((n) => ({
              label: n.title,
              url: n.link,
            })),
            custom: values.custom,
          });
          console.log("updating design settings ", updated);

          // render
          if (updated) {
            await renderPreview(iframeRef.current!);
            console.log("updated preview in", Date.now() - start);
          }
        } catch (e: any) {
          console.log("error", e);
          enqueueSnackbar("Error: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
        }
        setLoading(false);
      });
    },
    [setLoading],
  );

  const formik = useFormik({
    initialValues: initialDesignValue,
    // validationSchema: validationSchemaMakePrivateSite,
    validateOnChange: false,
    validate: async (values: DesignValues) => {
      return onSubmit(values);
    },
    onSubmit,
  });

  const handleCloseSettings = useCallback(() => {
    setOpenSettings(false);
    // no need to submit, we're submitting on blur
  }, [setOpenSettings, formik.submitForm]);

  const handleSwitchTheme = useCallback(async () => {
    setOpenSettings(false);
    // we submit on blur
    // await submitForm();
    router.push(`/preview?themeId=${themeId}&siteId=${siteId}`);
  }, [setOpenSettings, formik.submitForm, router]);

  const onBlur = useCallback(
    (e: any) => {
      formik.handleBlur(e);
    },
    [formik.handleBlur],
  );

  // const handleChangeNavigation = useCallback(
  //   (input: {
  //     id: string;
  //     type: "primary" | "secondary";
  //     field: "title" | "link";
  //     value: string;
  //   }) => {
  //     const navigation = formik.values.navigation;

  //     const item = navigation[input.type].find((item) => item.id === input.id);

  //     if (item) {
  //       item[input.field] = input.value;
  //     }

  //     formik.setFieldValue("navigation", navigation);
  //   },
  //   [formik.setFieldValue],
  // );

  // const handleAddLinkNavigation = useCallback(
  //   (type: "primary" | "secondary") => {
  //     formik.setFieldValue("navigation", {
  //       ...formik.values.navigation,
  //       [type]: [
  //         ...formik.values.navigation[type],
  //         { title: "", link: "", id: Date.now() },
  //       ],
  //     });
  //   },
  //   [formik.setFieldValue],
  // );

  // const handleRemoveLinkNavigation = useCallback(
  //   (input: { id: string; type: "primary" | "secondary" }) => {
  //     const navigation = formik.values.navigation;

  //     navigation[input.type] = navigation[input.type].filter(
  //       (item) => item.id !== input.id,
  //     );

  //     formik.setFieldValue("navigation", navigation);
  //   },
  //   [formik.setFieldValue],
  // );

  useEffect(() => {
    mounted = true;
  }, []);

  useEffect(() => {
    if (!themeId || !siteId || !isAuth) return;

    mutex.run(async () => {
      setLoading(true);
      try {
        const updated = await setPreviewSettings({
          themeId,
          siteId,
          design: true,
        });

        if (updated || mounted) {
          mounted = false;

          // init settings sidebar
          const info = getPreviewSiteInfo();
          const getCustomConfig = await getPreviewSiteThemeCustomSettings();
          const values: DesignValues = {
            accentColor: info.accent_color || "",
            banner: info.cover_image || "",
            description: info.description || "",
            icon: info.icon || "",
            logo: info.logo || "",
            name: info.title || "",
            shortName: info.name || "",
            navigation: {
              primary: info.navigation
                ? info.navigation.map((n) => ({
                    title: n.label,
                    link: n.url,
                    id: n.url,
                  }))
                : [],
              secondary: [],
            },
            custom: {},
          };

          for (const [key, value] of info.custom.entries())
            values.custom[key] = value;

          console.log("info", info, "values", values);
          formik.setValues(values, false);
          setCustomConfig(getCustomConfig);

          // render
          await renderPreview(iframeRef.current!);
        }
      } catch (e: any) {
        console.log("error", e);
        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      }
      setLoading(false);
    });
  }, [isAuth, themeId, siteId, iframeRef, formik.setValues, setLoading]);

  useEffect(() => {
    const img = new Image();
    img.src = formik.values.banner;

    img.onload = () => {
      setErrorLoadImage(true);
    };

    img.onerror = () => {
      setErrorLoadImage(false);
    };
  }, [formik.values.banner]);

  if (!themeId || !siteId) {
    return redirect("/");
  }

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 99,
            background: "#fff",
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SpinerWrap>
            <SpinnerCustom />
          </SpinerWrap>
        </Box>
      )}
      <StyledPreviewTestSite>
        <iframe
          ref={iframeRef}
          width={"100%"}
          height={"100%"}
          style={{ border: 0 }}
        ></iframe>
        {/* <Image src={previewImg?.preview as StaticImageData} alt="test site" /> */}
      </StyledPreviewTestSite>

      <StyledButtonOpenSetting
        onClick={handleOpenSettings}
        color="decorate"
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

          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChangeActiveTab}>
                <Tab sx={{ width: "50%" }} label="Site" value="site" />
                <Tab sx={{ width: "50%" }} label="Theme" value="theme" />
              </TabList>
            </Box>
            <TabPanel sx={{ px: 0 }} value="site">
              <StyledFormControl>
                <StyledLabel htmlFor="name">Title</StyledLabel>
                <StyledTextField
                  size="small"
                  fullWidth
                  id="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  onBlur={onBlur}
                />
              </StyledFormControl>

              <StyledFormControl>
                <StyledLabel htmlFor="name">Description</StyledLabel>
                <StyledTextField
                  size="small"
                  fullWidth
                  id="description"
                  multiline
                  rows={4}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  onBlur={onBlur}
                />
              </StyledFormControl>

              <StyledFormControl>
                <StyledLabel htmlFor="image">Icon</StyledLabel>
                <StyledTextField
                  size="small"
                  id="icon"
                  name="icon"
                  fullWidth
                  placeholder="Icon image url"
                  onChange={formik.handleChange}
                  value={formik.values.icon}
                  onBlur={onBlur}
                />
                {formik.values.icon && (
                  <StyledImgPreview>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Icon url" src={formik.values.icon} />
                  </StyledImgPreview>
                )}
              </StyledFormControl>

              <StyledFormControl>
                <StyledLabel htmlFor="logo">Logo</StyledLabel>
                <StyledTextField
                  size="small"
                  id="logo"
                  name="logo"
                  fullWidth
                  placeholder="Logo image url"
                  onChange={formik.handleChange}
                  value={formik.values.logo}
                  onBlur={onBlur}
                />
                {formik.values.logo && (
                  <StyledImgPreview>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt="Logo url" src={formik.values.logo} />
                  </StyledImgPreview>
                )}
              </StyledFormControl>

              <StyledFormControl>
                <StyledLabel htmlFor="banner">Banner</StyledLabel>
                <StyledTextField
                  size="small"
                  id="banner"
                  name="banner"
                  fullWidth
                  placeholder="Banner image url"
                  onChange={formik.handleChange}
                  value={formik.values.banner}
                  onBlur={onBlur}
                />
                {formik.values.banner && (
                  <StyledBannerPreview>
                    {isErrorLoadImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt="Banner url" src={formik.values.banner} />
                    ) : (
                      <Box
                        sx={{
                          margin: "auto",
                          paddingBottom: "30px",
                          paddingTop: "30px",
                        }}
                      >
                        <InsertPhotoTwoToneIcon sx={{ margin: "auto" }} />
                      </Box>
                    )}
                  </StyledBannerPreview>
                )}
              </StyledFormControl>

              <StyledFormControl>
                <StyledLabel>Accent color</StyledLabel>
                <MuiColorInput
                  fullWidth
                  format="hex"
                  value={formik.values.accentColor}
                  onBlur={onBlur}
                  onChange={(value) =>
                    formik.setFieldValue("accentColor", value)
                  }
                />
              </StyledFormControl>
            </TabPanel>
            <TabPanel sx={{ px: 0 }} value="theme">
              <StyledFormControl>
                <StyledLabel htmlFor="theme">Theme</StyledLabel>
                <StyledTextField
                  size="small"
                  fullWidth
                  id="theme"
                  value={getPreviewThemeName()}
                />
                <Button
                  onClick={handleSwitchTheme}
                  variant="contained"
                  fullWidth
                  size="medium"
                  color="darkInfo"
                >
                  Switch theme
                </Button>
              </StyledFormControl>

              {generateFormFields(customConfig, formik)}
            </TabPanel>
          </TabContext>

          {/* <StyledFormControl>
            <StyledLabel htmlFor="shortName">Short name</StyledLabel>
            <StyledTextField
              size="small"
              fullWidth
              id="shortName"
              onChange={handleChange}
              value={values.shortName}
              onBlur={onBlur}
            />
          </StyledFormControl> */}

          {/* 
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
          </StyledFormControl> */}
          {/* 
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
                            onBlur={onBlur}
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
                            onBlur={onBlur}
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
                            onBlur={onBlur}
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
                            onBlur={onBlur}
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
          </StyledFormControl> */}
        </StyledWrapper>
        <StyledBottomActions>
          <Button
            onClick={handleCloseSettings}
            variant="contained"
            fullWidth
            size="medium"
            color="darkInfo"
          >
            Preview
          </Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            fullWidth
            size="medium"
            color="decorate"
            disabled={isLoading}
          >
            Publish
          </Button>
        </StyledBottomActions>
      </Drawer>
    </>
  );
};

export default Design;
