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

interface IAnalyticsAdmin extends IBaseSetting {
  sendStats: boolean;
  handleSendStats: (value: boolean) => void;
}

export const AnalyticsAdmin = memo(
  ({ submitForm, sendStats, handleSendStats, isLoading }: IAnalyticsAdmin) => {
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
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      handleSendStats(event.target.checked);
    };

    return (
      <StyledSettingBlock id={SETTINGS_CONFIG.statsAdmin.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.statsAdmin.title}
            <SaveButton
              isEdit={isEdit}
              isLoading={isLoading}
              handleAction={handleClick}
            />
          </StyledTitleBlock>

          <StyledDescriptionBlock>
            {SETTINGS_CONFIG.statsAdmin.description}
          </StyledDescriptionBlock>
        </StyledHeadSettingBlock>

        <StyledFormFields>
          <FormControlLabel
            disabled={!isEdit}
            control={
              <Switch
                color="decorate"
                checked={sendStats}
                onChange={handleChangeSendStats}
              />
            }
            label={
              sendStats
                ? "Send analytics to you"
                : "Do not send analytics to you"
            }
          />
        </StyledFormFields>
      </StyledSettingBlock>
    );
  },
);

AnalyticsAdmin.displayName = "Analytics for site admin";
