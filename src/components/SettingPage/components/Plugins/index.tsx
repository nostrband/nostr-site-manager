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

interface IPlugins extends IBaseSetting {
  codeinjectionHead: string;
  codeinjectionFoot: string;
}

export const Plugins = ({
  codeinjectionHead,
  codeinjectionFoot,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: IPlugins) => {
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
    <StyledSettingCol id={HASH_CONFIG.PLUGINS}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Plugins</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Typography variant="body2" sx={{ mb: 1 }}>
          You can add custom html/css/js code into the header and footer of your
          website
        </Typography>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="codeinjection_head">
            Code injection in header
          </InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="codeinjection_head"
            name="codeinjection_head"
            label="Code injection in header"
            multiline
            rows={5}
            onChange={handleChange}
            value={codeinjectionHead}
            onBlur={handleBlur}
          />
        </StyledFormControl>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="codeinjection_foot">
            Code injection in footer
          </InputLabel>
          <OutlinedInput
            id="codeinjection_foot"
            name="codeinjection_foot"
            label="Code injection in footer"
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
