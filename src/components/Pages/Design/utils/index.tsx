"use client";
import { FormikProps } from "formik";
import { CustomConfigType } from "../types";
import { MenuItem, SelectChangeEvent } from "@mui/material";
import {
  StyledFormControl,
  StyledLabel,
  StyledSelectField,
  StyledTextField,
} from "../styled";
import React from "react";

type FieldPropsText = {
  name: string;
  label: string;
  value: any;
  options?: string[];
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.ChangeEvent<any>) => void;
};

type FieldPropsSelect = {
  name: string;
  label: string;
  value: any;
  options?: string[];
  onChange: (event: SelectChangeEvent<any>) => void;
};

const TextField: React.FC<FieldPropsText> = React.memo(
  ({ name, label, value, onChange, onBlur }) => (
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledTextField
        size="small"
        fullWidth
        id={name}
        name={name}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
      />
    </StyledFormControl>
  ),
);

TextField.displayName = "TextField";

const SelectField: React.FC<FieldPropsSelect> = React.memo(
  ({ name, label, value, options = [], onChange }) => (
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledSelectField
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </StyledSelectField>
    </StyledFormControl>
  ),
);

SelectField.displayName = "SelectField";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const generateFormFields = (
  config: CustomConfigType,
  formik: FormikProps<any>,
) => {
  return Object.keys(config).map((key) => {
    const field = config[key];
    const commonProps = {
      name: `custom.${key}`,
      label: capitalizeFirstLetter(key.replace("_", " ")),
      value: formik.values.custom[key],
      onChange: (event: SelectChangeEvent<any> | React.ChangeEvent<any>) => {
        if (event && event.target) {
          formik.setFieldValue(event.target.name, event.target.value);
        }
      },
      onBlur: formik.handleBlur,
    };

    switch (field.type) {
      case "text":
        return <TextField key={key} {...commonProps} />;
      case "select":
        return (
          <SelectField key={key} {...commonProps} options={field.options} />
        );
      default:
        return null;
    }
  });
};
