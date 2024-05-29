import React from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  FormControlLabel,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Switch,
  Typography,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { FormikErrors, FormikTouched } from "formik";
import { ReturnSettingsSiteDataType } from "@/services/sites.service";

interface ITitleDescription extends IBaseSetting {
  isPrivate: boolean;
  password: string;
  touched: FormikTouched<ReturnSettingsSiteDataType>;
  errors: FormikErrors<ReturnSettingsSiteDataType>;
  handleChangePrivate: (value: boolean) => void;
}

export const Private = ({
  isPrivate,
  password,
  handleChange,
  handleChangePrivate,
  handleBlur,
  submitForm,
  isLoading,
  touched,
  errors,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm);

  return (
    <StyledSettingCol id={HASH_CONFIG.PRIVATE}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Make site private</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleAction}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Enable protection with a simple shared password.
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <FormControlLabel
            control={
              <Switch
                checked={isPrivate}
                onChange={() => handleChangePrivate(!isPrivate)}
                color="success"
              />
            }
            label="Make a site private"
          />
        </StyledFormControl>

        {isPrivate && (
          <StyledFormControl
            disabled={!isEdit}
            error={touched.password && Boolean(errors.password)}
            fullWidth
            size="small"
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              name="password"
              label="Password"
              onChange={handleChange}
              value={password}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
            />
            {touched.password && errors.password && (
              <FormHelperText>{errors.password}</FormHelperText>
            )}
          </StyledFormControl>
        )}
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
