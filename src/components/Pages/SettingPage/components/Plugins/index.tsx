import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";

interface IPlugins extends IBaseSetting {
  codeinjectionHead: string;
  codeinjectionFoot: string;
}

export const Plugins = memo(
  ({
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
      <StyledSettingBlock id={SETTINGS_CONFIG.plugins.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.plugins.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.plugins.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFormFields>
          <FormControl disabled={!isEdit} fullWidth size="small">
            <InputLabel htmlFor="codeinjection_head">
              Code injection in header
            </InputLabel>
            <OutlinedInput
              inputRef={inputRef}
              id="codeinjection_head"
              name="codeinjection_head"
              label="Code injection in header"
              multiline
              rows={3}
              onChange={handleChange}
              value={codeinjectionHead}
              onBlur={handleBlur}
            />
          </FormControl>

          <FormControl disabled={!isEdit} fullWidth size="small">
            <InputLabel htmlFor="codeinjection_foot">
              Code injection in footer
            </InputLabel>
            <OutlinedInput
              id="codeinjection_foot"
              name="codeinjection_foot"
              label="Code injection in footer"
              multiline
              rows={3}
              onChange={handleChange}
              value={codeinjectionFoot}
              onBlur={handleBlur}
            />
          </FormControl>
        </StyledFormFields>
      </StyledSettingBlock>
    );
  },
);

Plugins.displayName = "Plugins";
