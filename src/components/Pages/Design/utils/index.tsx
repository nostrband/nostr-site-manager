"use client";
import { FormikErrors, FormikProps } from "formik";
import { CustomConfigType } from "../types";
import {
  FormControlLabel,
  MenuItem,
  SelectChangeEvent,
  Switch,
} from "@mui/material";
import {
  StyledDescriptionField,
  StyledFormControl,
  StyledLabel,
  StyledSelectField,
  StyledTextField,
  StyledTitleGroupField,
} from "../styled";
import React from "react";
import { MuiColorInput } from "mui-color-input";

type FieldProps = {
  name: string;
  label: string;
  description?: string;
  value: any;
  options?: string[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<any>>;
  onBlur?: (e: React.ChangeEvent<any>) => void;
  validate?: (values?: any) => Promise<FormikErrors<any>>;
};

const BooleanField: React.FC<FieldProps> = React.memo(
  ({ name, label, value, setFieldValue, validate, description }) => (
    <StyledFormControl>
      <StyledLabel>{label}</StyledLabel>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(_, v) =>
              setFieldValue(name, v).then(() => {
                validate && validate();
              })
            }
            name={name}
          />
        }
        label={label}
      />

      {description && (
        <StyledDescriptionField variant="body2">
          {description}
        </StyledDescriptionField>
      )}
    </StyledFormControl>
  ),
);

BooleanField.displayName = "BooleanField";

const TextField: React.FC<FieldProps> = React.memo(
  ({ name, label, value, setFieldValue, onBlur, description }) => (
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledTextField
        size="small"
        fullWidth
        id={name}
        name={name}
        onChange={(e) => setFieldValue(name, e.target.value)}
        value={value}
        onBlur={onBlur}
      />
      {description && (
        <StyledDescriptionField variant="body2">
          {description}
        </StyledDescriptionField>
      )}
    </StyledFormControl>
  ),
);

TextField.displayName = "TextField";

const ColorField: React.FC<FieldProps> = React.memo(
  ({ name, label, value, setFieldValue, onBlur, description }) => (
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <MuiColorInput
        fullWidth
        format="hex"
        value={value}
        onBlur={onBlur}
        onChange={(v) => setFieldValue(name, v)}
      />
      {description && (
        <StyledDescriptionField variant="body2">
          {description}
        </StyledDescriptionField>
      )}
    </StyledFormControl>
  ),
);

ColorField.displayName = "ColorField";

const SelectField: React.FC<FieldProps> = React.memo(
  ({
    name,
    label,
    value,
    options = [],
    setFieldValue,
    validate,
    onBlur,
    description,
  }) => (
    <StyledFormControl>
      <StyledLabel htmlFor={name}>{label}</StyledLabel>
      <StyledSelectField
        id={name}
        name={name}
        value={value}
        onBlur={onBlur}
        onChange={(e) => {
          setFieldValue(name, e.target.value).then(() => {
            validate && validate();
          });
        }}
      >
        {options.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </StyledSelectField>
      {description && (
        <StyledDescriptionField variant="body2">
          {description}
        </StyledDescriptionField>
      )}
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
  const noGroupFields: JSX.Element[] = [];
  const groupedFields: { [key: string]: JSX.Element[] } = {};

  Object.keys(config).forEach((key) => {
    const field = config[key];
    let value = field.default;
    if (key in formik.values.custom) {
      const fieldValue = formik.values.custom[key];
      if (!field.options || field.options.includes(fieldValue))
        value = fieldValue;
    }

    // we used to write true/false into tags :(
    if (field.type === "boolean") value = value === true || value === "true";

    const commonProps = {
      name: `custom.${key}`,
      description: field.description,
      label: capitalizeFirstLetter(key.replace(/_/g, " ")),
      value,
      setFieldValue: formik.setFieldValue,
      onBlur: formik.handleBlur,
      validate: formik.validateForm,
    };

    let fieldElement: JSX.Element | null = null;
    if (field.type === "text") {
      fieldElement = <TextField key={key} {...commonProps} />;
    } else if (field.type === "select") {
      fieldElement = (
        <SelectField key={key} {...commonProps} options={field.options} />
      );
    } else if (field.type === "image") {
      fieldElement = <TextField key={key} {...commonProps} />;
    } else if (field.type === "color") {
      fieldElement = <ColorField key={key} {...commonProps} />;
    } else if (field.type === "boolean") {
      fieldElement = <BooleanField key={key} {...commonProps} />;
    }

    if (fieldElement) {
      if (field.group) {
        if (!groupedFields[field.group]) {
          groupedFields[field.group] = [];
        }
        groupedFields[field.group].push(fieldElement);
      } else {
        noGroupFields.push(fieldElement);
      }
    }
  });

  const resultFields: JSX.Element[] = [
    ...noGroupFields,
    ...Object.keys(groupedFields).flatMap((group) => [
      <StyledTitleGroupField variant="h5" key={`group-${group}`}>
        {capitalizeFirstLetter(group.replace("_", " "))}
      </StyledTitleGroupField>,
      ...groupedFields[group],
    ]),
  ];

  return resultFields;
};
