"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  StyledWrap,
  StyledInputAdornment,
  StyledFormControl,
  StyledSubTitle,
  StyledBottomAuth,
  StyledLink,
} from "@/modules/auth/styled";
import {
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import { useFormik } from "formik";
import { validationSchemaLogin } from "@/validations/rules";
import { AuthUserDTO } from "@/types/auth.types";

export const LoginModule = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  const initialValues: AuthUserDTO = {
    email: "",
    username: "",
  };

  const {
    values,
    isValid,
    dirty,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    errors,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchemaLogin,
    onSubmit: async (values) => {
      setIsLoading(true);

      console.log({ values });

      setTimeout(() => {
        push("/");
      }, 1500);
    },
  });

  return (
    <StyledWrap>
      <Typography gutterBottom variant="h4" component="div">
        Login
      </Typography>
      <StyledSubTitle variant="body2">
        Login to create and manage a blog
      </StyledSubTitle>
      <form onSubmit={handleSubmit}>
        <StyledFormControl
          fullWidth
          error={touched.email && Boolean(errors.email)}
        >
          <InputLabel htmlFor="email">Email</InputLabel>
          <OutlinedInput
            id="email"
            name="email"
            startAdornment={
              <StyledInputAdornment position="start">
                <EmailTwoToneIcon
                  color={
                    touched.email && Boolean(errors.email) ? "error" : "inherit"
                  }
                />
              </StyledInputAdornment>
            }
            label="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email && Boolean(errors.email)}
          />
          {touched.email && errors.email && (
            <FormHelperText>{errors.email}</FormHelperText>
          )}
        </StyledFormControl>

        <StyledFormControl
          fullWidth
          error={touched.username && Boolean(errors.username)}
        >
          <InputLabel htmlFor="username">Name</InputLabel>
          <OutlinedInput
            id="username"
            name="username"
            startAdornment={
              <StyledInputAdornment position="start">
                <AccountCircleTwoToneIcon
                  color={
                    touched.username && Boolean(errors.username)
                      ? "error"
                      : "inherit"
                  }
                />
              </StyledInputAdornment>
            }
            label="Name"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username && Boolean(errors.username)}
          />
          {touched.username && errors.username && (
            <FormHelperText>{errors.username}</FormHelperText>
          )}
        </StyledFormControl>

        <LoadingButton
          color="primary"
          variant="contained"
          type="submit"
          fullWidth
          size="large"
          loading={isLoading}
          disabled={!(isValid && dirty) || isLoading}
        >
          Login
        </LoadingButton>
      </form>

      <StyledBottomAuth variant="body2">
        If you dont have an account, you can{" "}
        <StyledLink href="#">create an account</StyledLink>
      </StyledBottomAuth>
    </StyledWrap>
  );
};
