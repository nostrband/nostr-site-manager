"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import { Typography, Button, Box } from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { CustomDomainForm } from "../CustomDomainForm";
import { fetchDomains } from "@/services/nostr/api";

interface ICustomDomains extends IBaseSetting {
  siteId: string;
  updateWebSiteAddress: (url: string) => void;
}

export const CustomDomains = ({
  siteId,
  submitForm,
  isLoading,
  updateWebSiteAddress,
}: ICustomDomains) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [listDomains, setListDomains] = useState<string[]>([]);
  const [isOpenCustomDomain, setOpenCustomDomain] = useState(false);

  const handleCloseCustomDomain = () => {
    setOpenCustomDomain(false);
  };

  const handleOpenCustomDomain = () => {
    setOpenCustomDomain(true);
  };

  const handleClick = () => {
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  const handleUpdateWebSiteAddress = async (url: string) => {
    updateWebSiteAddress(url);
    handleAction(); // simulate "Save" click
  };

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const getDomains = async () => {
    if (siteId) {
      const res = await fetchDomains(siteId);
      console.log({ res });
      console.log("getDomains", res);
  
      setListDomains(res.domains.map((d: any) => d.domain));  
    } else {
      setListDomains([]);
    }
  };

  useEffect(() => {
    getDomains();
  }, [siteId]);

  return (
    <StyledSettingCol id={HASH_CONFIG.CUSTOM_DOMAINS}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Custom domains</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <Box>
          {Boolean(listDomains.length) ? (
            <>
              {listDomains.map((el, i) => (
                <Typography key={i} variant="body2">
                  {el}
                </Typography>
              ))}
            </>
          ) : (
            <Typography variant="body2">
              You not have custom domains!
            </Typography>
          )}
        </Box>

        <StyledFormControl
          sx={{ mt: 1 }}
          disabled={!isEdit}
          fullWidth
          size="small"
        >
          <Button
            sx={{ mt: 1 }}
            variant="contained"
            disabled={!isEdit}
            color="primary"
            onClick={handleOpenCustomDomain}
          >
            Add custom domain
          </Button>

          <CustomDomainForm
            onClose={handleCloseCustomDomain}
            isOpen={isOpenCustomDomain}
            siteId={siteId}
            updateWebSiteAddress={handleUpdateWebSiteAddress}
          />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
