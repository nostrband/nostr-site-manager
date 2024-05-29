"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSettingsSite } from "@/hooks/useSettingsSite";
import { useParams } from "next/navigation";
import { SpinerCircularProgress, SpinerWrap } from "@/components/Spiner";
import { useFormik } from "formik";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";
import { TitleDescription } from "@/components/SettingPage/components/TitleDescription";
import { Timezone } from "@/components/SettingPage/components/Timezone";
import { Language } from "@/components/SettingPage/components/Language";
import { MetaData } from "@/components/SettingPage/components/MetaData";
import { XCard } from "@/components/SettingPage/components/XCard";
import { FCard } from "@/components/SettingPage/components/FCard";
import { SocialAccounts } from "@/components/SettingPage/components/SocialAccounts";
import { Private } from "@/components/SettingPage/components/Private";
import { validationSchemaMakePrivateSite } from "@/validations/rules";

const initialSettingValue = {
  id: "",
  title: "",
  description: "",
  timezone: {
    name: "",
    label: "",
  },
  language: "",
  metaDescription: "",
  metaTitle: "",
  xTitle: "",
  xDescription: "",
  fTitle: "",
  fDescription: "",
  socialAccountFaceBook: "",
  socialAccountX: "",
  isPrivate: false,
  password: "",
};

export const SettingPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [initialData, setInitialData] = useState(initialSettingValue);

  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const siteId = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data,
    isLoading: isLoadingSetting,
    isFetching,
  } = useSettingsSite(siteId);

  const {
    values,
    submitForm,
    handleChange,
    setFieldValue,
    handleBlur,
    setValues,
    touched,
    errors,
  } = useFormik({
    initialValues: initialSettingValue,
    validationSchema: validationSchemaMakePrivateSite,
    onSubmit: async (values) => {
      // maybe send all  data ?
      // const changedData: Partial<ReturnSettingsSiteDataType> = {};
      //
      // for (const key in values) {
      //   const keySetting = key as keyof ReturnSettingsSiteDataType;
      //
      //   if (
      //     values.hasOwnProperty(key) &&
      //     values[keySetting] !== initialData[keySetting]
      //   ) {
      //     changedData[keySetting] = values[keySetting];
      //   }
      // }

      function isObject(obj: any): obj is Object {
        return obj !== null && typeof obj === "object";
      }

      function deepCompareAndCollectChanges<T>(
        initial: T,
        current: T,
      ): Partial<T> {
        const changes: Partial<T> = {};

        for (const key in current) {
          // @ts-ignore
          if (current.hasOwnProperty(key)) {
            const initialVal = initial[key];
            const currentVal = current[key];

            if (isObject(initialVal) && isObject(currentVal)) {
              const nestedChanges = deepCompareAndCollectChanges(
                initialVal,
                currentVal,
              );
              if (Object.keys(nestedChanges).length > 0) {
                changes[key] = nestedChanges as any;
              }
            } else if (currentVal !== initialVal) {
              changes[key] = currentVal;
            }
          }
        }

        return changes;
      }

      const changedData: Partial<ReturnSettingsSiteDataType> =
        deepCompareAndCollectChanges(initialData, values);

      if (Object.keys(changedData).length) {
        setIsLoading(true);
        setTimeout(() => {
          setInitialData((prev) => ({
            ...prev,
            ...changedData,
          }));

          console.log({ changedData });

          enqueueSnackbar("Edit data success!", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });

          setIsLoading(false);
        }, 1500);
      }
    },
  });

  const handleChangeTimezone = (
    value: {
      name: string;
      label: string;
    } | null,
  ) => {
    if (value) {
      setFieldValue("timezone", value);
    } else {
      setFieldValue("timezone", {
        name: "",
        label: "",
      });
    }
  };

  const handleChangePrivate = (value: boolean) => {
    setFieldValue("isPrivate", value);
  };

  useEffect(() => {
    if (data) {
      setValues(data);
      setInitialData(data);
    }
  }, [setValues, data]);

  if (isLoadingSetting || isFetching) {
    return (
      <SpinerWrap>
        <SpinerCircularProgress />
      </SpinerWrap>
    );
  }

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        General settings
      </Typography>
      <TitleDescription
        title={values.title}
        description={values.description}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <Timezone
        timezone={values.timezone}
        submitForm={submitForm}
        isLoading={isLoading}
        handleChangeTimezone={handleChangeTimezone}
      />
      <Language
        language={values.language}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <MetaData
        title={values.metaTitle}
        description={values.metaDescription}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <XCard
        title={values.xTitle}
        description={values.xDescription}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <FCard
        title={values.fTitle}
        description={values.fDescription}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <SocialAccounts
        socialAccountFaceBook={values.socialAccountFaceBook}
        socialAccountX={values.socialAccountX}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
      />
      <Private
        handleChangePrivate={handleChangePrivate}
        isPrivate={values.isPrivate}
        password={values.password}
        handleBlur={handleBlur}
        handleChange={handleChange}
        submitForm={submitForm}
        isLoading={isLoading}
        touched={touched}
        errors={errors}
      />
    </>
  );
};
