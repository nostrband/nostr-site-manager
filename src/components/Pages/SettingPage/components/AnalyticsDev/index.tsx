import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { FormControlLabel, Switch } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";

interface IAnalyticsDev extends IBaseSetting {
  sendStatsDev: boolean;
  handleSendStatsDev: (value: boolean) => void;
}

export const AnalyticsDev = memo(
  ({
    submitForm,
    sendStatsDev,
    handleSendStatsDev,
    isLoading,
  }: IAnalyticsDev) => {
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

    const handleChangeSendStats = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      handleSendStatsDev(event.target.checked);
    };

    return (
      <StyledSettingBlock id={SETTINGS_CONFIG.statsDev.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.statsDev.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.statsDev.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFormFields>
          <FormControlLabel
            disabled={!isEdit}
            control={
              <Switch checked={sendStatsDev} onChange={handleChangeSendStats} />
            }
            label={
              sendStatsDev
                ? "Send anonymised analytics to developers"
                : "Do not send anonymised analytics to developers"
            }
          />
        </StyledFormFields>
      </StyledSettingBlock>
    );
  }
);

AnalyticsDev.displayName = "Analytics for developers";
