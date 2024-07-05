"use client";
import CloseIcon from "@mui/icons-material/Close";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import TuneIcon from "@mui/icons-material/Tune";
import { Fab, Drawer, Button, Box } from "@mui/material";
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
  StyledItemNavigation,
} from "@/components/Pages/Design/styled";
import { useFormik } from "formik";
import { validationSchemaMakePrivateSite } from "@/validations/rules";
import { MuiColorInput } from "mui-color-input";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AuthContext, userPubkey } from "@/services/nostr/nostr";
import {
  Mutex,
  getPreviewSiteInfo,
  getPreviewThemeName,
  renderPreview,
  setPreviewSettings,
  startPreviewPublish,
  updatePreviewSite,
} from "@/services/nostr/themes";
import { SpinerWrap } from "@/components/Spiner";
import { SpinnerCustom } from "@/components/SpinnerCustom";

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
  // hashtags: string[];
  // kinds: string[];
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
  // hashtags: [],
  // kinds: [],
};

// const hashtags = [
//   "#cooking",
//   "#photography",
//   "#nostr",
//   "#travel",
//   "#grownostr",
// ];

// const kinds = ["Notes", "Long notes"];

const mutex = new Mutex();

let mounted = false;

export const Design = () => {
  const router = useRouter();
  const authed = useContext(AuthContext);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const params = useSearchParams();
  const siteId = params.get("siteId");
  const themeId = params.get("themeId");
  // const theme = THEMES_PREVIEW.find((el) => el.id === themeId);
  // const previewImg = THEMES_PREVIEW.find((el) => el.id === themeId);
  const [isOpenSettings, setOpenSettings] = useState(true);
  const [activeTab, setActiveTab] = useState("1");
  const [isLoading, setLoading] = useState<boolean>(false);

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
        });
        console.log("updating design settings ", updated);

        // render
        if (updated) {
          await renderPreview(iframeRef.current!);
          console.log("updated preview in", Date.now() - start);
        }
        setLoading(false);
      });
    },
    [setLoading],
  );

  const {
    values,
    setValues,
    submitForm,
    handleChange,
    setFieldValue,
    handleBlur,
  } = useFormik({
    initialValues: initialDesignValue,
    validationSchema: validationSchemaMakePrivateSite,
    validateOnChange: false,
    validate: async (values: DesignValues) => {
      return onSubmit(values);
    },
    onSubmit,
  });

  const handleCloseSettings = useCallback(() => {
    setOpenSettings(false);
    // no need to submit, we're submitting on blur
  }, [setOpenSettings, submitForm]);

  const handleSwitchTheme = useCallback(async () => {
    setOpenSettings(false);
    // we submit on blur
    // await submitForm();
    router.push(`/preview?themeId=${themeId}&siteId=${siteId}`);
  }, [setOpenSettings, submitForm, router]);

  const onBlur = useCallback(
    (e: any) => {
      handleBlur(e);
    },
    [handleBlur],
  );

  const handleChangeNavigation = useCallback(
    (input: {
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
    },
    [setFieldValue],
  );

  const handleAddLinkNavigation = useCallback(
    (type: "primary" | "secondary") => {
      setFieldValue("navigation", {
        ...values.navigation,
        [type]: [
          ...values.navigation[type],
          { title: "", link: "", id: Date.now() },
        ],
      });
    },
    [setFieldValue],
  );

  const handleRemoveLinkNavigation = useCallback(
    (input: { id: string; type: "primary" | "secondary" }) => {
      const navigation = values.navigation;

      navigation[input.type] = navigation[input.type].filter(
        (item) => item.id !== input.id,
      );

      setFieldValue("navigation", navigation);
    },
    [setFieldValue],
  );

  useEffect(() => {
    mounted = true;
  }, []);

  useEffect(() => {
    if (!themeId || !siteId || !authed) return;

    mutex.run(async () => {
      setLoading(true);
      const updated = await setPreviewSettings({
        themeId,
        siteId,
        design: true,
      });

      if (updated || mounted) {
        mounted = false;

        // init settings sidebar
        const info = getPreviewSiteInfo();
        const values: DesignValues = {
          accentColor: info.accent_color || "",
          banner: info.cover_image || "",
          description: info.description || "",
          icon: info.icon || "",
          logo: info.logo || "",
          name: info.title || "",
          shortName: info.name || "",
          // hashtags: info.include_tags
          //   ? info.include_tags.filter((t) => t.tag === "t").map((t) => t.value)
          //   : [],
          // kinds: info.include_kinds || [],
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
        };
        console.log("info", info, "values", values);
        setValues(values, false);

        // render
        await renderPreview(iframeRef.current!);
      }
      setLoading(false);
    });
  }, [authed, themeId, siteId, iframeRef, setValues, setLoading]);

  if (!themeId || !siteId) {
    return redirect("/");
  }

  console.log({ values });

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

          <StyledFormControl>
            <StyledLabel htmlFor="name">Title</StyledLabel>
            <StyledTextField
              size="small"
              fullWidth
              id="name"
              onChange={handleChange}
              value={values.name}
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
              onChange={handleChange}
              value={values.description}
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
              onChange={handleChange}
              value={values.icon}
              onBlur={onBlur}
            />
            <StyledImgPreview>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {values.icon && <img alt="Icon url" src={values.icon} />}
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
              onBlur={onBlur}
            />
            <StyledImgPreview>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {values.logo && <img alt="Logo url" src={values.logo} />}
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
              onBlur={onBlur}
            />
            <StyledBannerPreview>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {values.banner && <img alt="Banner url" src={values.banner} />}
            </StyledBannerPreview>
          </StyledFormControl>

          <StyledFormControl>
            <StyledLabel>Accent color</StyledLabel>
            <MuiColorInput
              fullWidth
              format="hex"
              value={values.accentColor}
              onBlur={onBlur}
              onChange={(value) => setFieldValue("accentColor", value)}
            />
          </StyledFormControl>
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
          >
            Publish
          </Button>
        </StyledBottomActions>
      </Drawer>
    </>
  );
};
