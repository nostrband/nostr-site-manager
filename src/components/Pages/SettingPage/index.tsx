"use client";
import React, { useCallback, useEffect, useState } from "react";
import _ from "lodash";
import { Button, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import { redirect } from "next/navigation";
import { useFormik } from "formik";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { SETTINGS_CONFIG } from "@/consts";
import { addHttps } from "@/utils";
import { editSite } from "@/services/nostr/api";
import { validationSchemaMakePrivateSite } from "@/validations/rules";
import { TitleDescription } from "./components/TitleDescription";
import { Contributors } from "./components/Contributors";
import { DesignBranding } from "./components/DesignBranding";
import { Recommendation } from "./components/Recommendation";
import { Icon } from "./components/Icon";
import { ImageBanner } from "./components/Image";
import { Content } from "./components/Content";
import { AccentColor } from "./components/AccentColor";
import { WebsiteAddress } from "./components/WebsiteAddress";
import { Plugins } from "./components/Plugins";
import { AppName } from "./components/AppName";
import { CustomDomains } from "./components/CustomDomains";
import { Other } from "./components/Other";
import { PinnedNotes } from "./components/PinnedNotes";
import { Navigation, NavigationModelType } from "./components/Navigation";
import { Logo } from "./components/Logo";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import {
  SearchSettingsFieldWrap,
  StyledTitle,
  StyledTitleSection,
  StyledWrap,
  StyledWrapSectionSettings,
  StyledWrapSettings,
} from "./styled";
import Link from "next/link";
import { ChevronLeftIcon } from "@/components/Icons";
import { SearchSettingsField, Setting } from "./components/SearchSettingsField";
import { useGetSiteId } from "@/hooks/useGetSiteId";

const initialSettingValue: ReturnSettingsSiteDataType = {
  id: "",
  themeId: "",
  themeName: "",
  contributors: [],
  name: "",
  title: "",
  description: "",
  timezone: {
    name: "",
    label: "",
  },
  language: "",
  metaDescription: "",
  metaTitle: "",
  ogDescription: "",
  ogTitle: "",
  ogImage: "",
  xTitle: "",
  xDescription: "",
  xImage: "",
  fTitle: "",
  fDescription: "",
  socialAccountFaceBook: "",
  socialAccountX: "",
  icon: "",
  image: "",
  logo: "",
  url: "",
  navigation: {
    primary: [],
    secondary: [],
  },
  hashtags: [],
  kinds: [],
  hashtags_homepage: [],
  kinds_homepage: [],
  accentColor: "",
  codeinjection_foot: "",
  codeinjection_head: "",
  adminPubkey: "",
  postsPerPage: "",
  contentActionMain: "",
  contentActions: [],
};

export const SettingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(initialSettingValue);
  const [choiceSetting, setChoiceSetting] = useState<Setting | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { siteId } = useGetSiteId()

  const {
    data,
    isLoading: isLoadingSetting,
    isFetching,
  } = useSettingsSite(siteId);

  const backToDashboardLink = `/admin/${siteId}/dashboard`;

  const handleChoiceSetting = (setting: Setting | null) => {
    setChoiceSetting(setting);
  };

  const {
    values,
    submitForm,
    handleChange,
    setFieldValue,
    handleBlur,
    setValues,
  } = useFormik({
    initialValues: initialSettingValue,
    validationSchema: validationSchemaMakePrivateSite,
    onSubmit: async (values) => {
      console.log("onSubmit", values, initialData);
      if (!_.isEqual(values, initialData)) {
        setIsLoading(true);

        setInitialData(() => values);

        console.log({ values });

        try {
          await editSite(values);
          enqueueSnackbar("Edit data success!", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
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
          setIsLoading(false);
        }
      }
    },
  });

  const handleChangeNavigation = useCallback(
    (input: {
      id: string;
      type: "primary" | "secondary";
      field: "title" | "link";
      value: string;
    }) => {
      const navigation = values.navigation[input.type].map((item) => {
        if (item.id === input.id) {
          return {
            ...item,
            [input.field]: input.value,
          };
        }

        return item;
      });

      setFieldValue(`navigation.${input.type}`, navigation);
    },
    [setFieldValue, values.navigation],
  );

  const handleChangeNavigationOrder = useCallback(
    (navigation: NavigationModelType) => {
      setFieldValue("navigation", navigation);
    },
    [setFieldValue],
  );

  const handleAddLinkNavigation = useCallback(
    (type: "primary" | "secondary") => {
      setFieldValue(`navigation.${type}`, [
        ...values.navigation[type],
        { title: "", link: "", id: "" + Date.now() },
      ]);
    },
    [setFieldValue, values.navigation],
  );

  const handleChangeHashtags = useCallback(
    (value: string | string[]) => {
      setFieldValue("hashtags", value);
    },
    [setFieldValue],
  );

  const handleChangeHashtagsHomePage = useCallback(
    (value: string | string[]) => {
      setFieldValue("hashtags_homepage", value);
    },
    [setFieldValue],
  );

  const handleChangeContributors = useCallback(
    (pubkeys: string[]) => {
      setFieldValue("contributors", pubkeys);
    },
    [setFieldValue],
  );

  const handleUpdateWebSiteAddress = useCallback(
    async (url: string) => {
      setFieldValue("url", addHttps(url));
    },
    [setFieldValue],
  );

  const handleChangeContentActions = useCallback(
    (value: string[]) => {
      setFieldValue("contentActions", value);
    },
    [setFieldValue],
  );

  const handleChangeKinds = useCallback(
    (value: number | number[]) => {
      setFieldValue("kinds", value);
    },
    [setFieldValue],
  );

  const handleOptionsMainCallAction = useCallback(
    (value: string) => {
      setFieldValue("contentActionMain", value);
    },
    [setFieldValue],
  );

  const handleChangeKindsHomePage = useCallback(
    (value: number | number[]) => {
      setFieldValue("kinds_homepage", value);
    },
    [setFieldValue],
  );

  const handleChangeColor = useCallback(
    (color: string) => {
      setFieldValue("accentColor", color);
    },
    [setFieldValue],
  );

  const handleRemoveLinkNavigation = useCallback(
    (input: { id: string; type: "primary" | "secondary" }) => {
      const navigation = values.navigation[input.type].filter(
        (item) => item.id !== input.id,
      );

      setFieldValue(`navigation.${[input.type]}`, navigation);
    },
    [setFieldValue, values.navigation],
  );

  useEffect(() => {
    if (data) {
      setValues(data);
      const initial = _.cloneDeep(data);
      setInitialData(initial);
      console.log("initial values", initial);
    }
  }, [setValues, data]);

  useEffect(() => {
    if (data) {
      if (!isLoadingSetting && !isFetching && Object.keys(data).length === 0) {
        redirect("/admin");
      }
    }

    if (!isLoadingSetting && !isFetching) {
      const hash = window.location.hash;

      if (hash) {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);

        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 100);
        }
      }
    }
  }, [isLoadingSetting, isFetching, data]);

  useEffect(() => {
    if (choiceSetting) {
      const element = document.getElementById(choiceSetting.anchor);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });

        setChoiceSetting(null);
      }
    }
  }, [choiceSetting]);

  if (isLoadingSetting || isFetching) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledWrap>
        <StyledTitle>
          <Button
            LinkComponent={Link}
            href={backToDashboardLink}
            color="primary"
            variant="text"
            sx={{ minWidth: "auto" }}
          >
            <ChevronLeftIcon />
          </Button>
          Settings
        </StyledTitle>

        <SearchSettingsFieldWrap>
          <SearchSettingsField
            choiceSetting={choiceSetting}
            handleChoiceSetting={handleChoiceSetting}
          />
        </SearchSettingsFieldWrap>

        <StyledWrapSettings>
          <StyledTitleSection>General settings</StyledTitleSection>

          <StyledWrapSectionSettings>
            <WebsiteAddress
              url={values.url}
              siteId={values.id}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <CustomDomains
              siteId={values.id}
              submitForm={submitForm}
              updateWebSiteAddress={handleUpdateWebSiteAddress}
              isLoading={isLoading}
            />

            <TitleDescription
              title={values.title}
              description={values.description}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            {/* <MetaData
        title={values.metaTitle}
        description={values.metaDescription}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      /> */}

            <Contributors
              handleChangeContributors={handleChangeContributors}
              contributors={values.contributors}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <Content
              anchor={SETTINGS_CONFIG.content.anchor}
              handleChangeHashtags={handleChangeHashtags}
              contributors={values.contributors}
              selectedHashtags={values.hashtags}
              handleChangeKinds={handleChangeKinds}
              selectedKinds={values.kinds}
              submitForm={submitForm}
              isLoading={isLoading}
              title={SETTINGS_CONFIG.content.title}
              description={SETTINGS_CONFIG.content.description}
            />

            <Plugins
              codeinjectionHead={values.codeinjection_head}
              codeinjectionFoot={values.codeinjection_foot}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <Other
              postsPerPage={values.postsPerPage}
              contentActionMain={values.contentActionMain}
              handleOptionsMainCallAction={handleOptionsMainCallAction}
              handleChangeContentActions={handleChangeContentActions}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              selectedContentActions={values.contentActions}
              isLoading={isLoading}
            />

            <PinnedNotes siteId={values.id} />
          </StyledWrapSectionSettings>

          <StyledTitleSection>Design</StyledTitleSection>

          <StyledWrapSectionSettings>
            <AppName
              name={values.name}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <DesignBranding
              siteId={values.id}
              themeName={values.themeName}
              themeId={values.themeId}
            />

            <AccentColor
              handleChangeColor={handleChangeColor}
              color={values.accentColor}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <Icon
              icon={values.icon}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <Logo
              logo={values.logo}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <ImageBanner
              image={values.image}
              handleBlur={handleBlur}
              handleChange={handleChange}
              submitForm={submitForm}
              isLoading={isLoading}
            />

            <Navigation
              navigation={values.navigation}
              handleChangeNavigation={handleChangeNavigation}
              handleChangeNavigationOrder={handleChangeNavigationOrder}
              submitForm={submitForm}
              isLoading={isLoading}
              handleAddLinkNavigation={handleAddLinkNavigation}
              handleRemoveLinkNavigation={handleRemoveLinkNavigation}
            />
          </StyledWrapSectionSettings>

          <StyledTitleSection>Homepage</StyledTitleSection>

          <Content
            anchor={SETTINGS_CONFIG.homepageContent.anchor}
            handleChangeHashtags={handleChangeHashtagsHomePage}
            handleChangeKinds={handleChangeKindsHomePage}
            contributors={values.contributors}
            selectedHashtags={values.hashtags_homepage}
            selectedKinds={values.kinds_homepage}
            submitForm={submitForm}
            isLoading={isLoading}
            title={SETTINGS_CONFIG.homepageContent.title}
            description={SETTINGS_CONFIG.homepageContent.description}
          />

          <StyledTitleSection>Growth</StyledTitleSection>

          <Recommendation />
        </StyledWrapSettings>
      </StyledWrap>
    </Container>
  );
};
