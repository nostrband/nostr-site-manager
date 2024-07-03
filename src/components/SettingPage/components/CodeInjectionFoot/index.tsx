import React, { useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { InputLabel, OutlinedInput, Typography } from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";

interface ICodeInjectionFoot extends IBaseSetting {
  codeinjectionFoot: string;
}

export const CodeInjectionFoot = ({
  codeinjectionFoot,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ICodeInjectionFoot) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  return (
    <StyledSettingCol id={HASH_CONFIG.CODE_INJECTION_FOOT}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Code injection foot</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Write some script for foot
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="codeinjection_foot">
            Code injection foot
          </InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="codeinjection_foot"
            name="codeinjection_foot"
            label="Code injection foot"
            multiline
            rows={5}
            onChange={handleChange}
            value={codeinjectionFoot}
            onBlur={handleBlur}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
