"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import { Button } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { SETTINGS_CONFIG } from "@/consts";
import { CustomDomainForm } from "../CustomDomainForm";
import { fetchDomains } from "@/services/nostr/api";
import { enqueueSnackbar } from "notistack";
import { userIsReadOnly } from "@/services/nostr/nostr";
import { PlusCircleIcon } from "@/components/Icons";
import { ItemDomain } from "./components/ItemDomain";

interface ICustomDomains extends IBaseSetting {
  siteId: string;
  updateWebSiteAddress: (url: string) => void;
}

export const CustomDomains = memo(
  ({ siteId, submitForm, isLoading, updateWebSiteAddress }: ICustomDomains) => {
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
      if (siteId && !userIsReadOnly) {
        try {
          const res = await fetchDomains(siteId);
          console.log({ res });
          console.log("getDomains", res);
          setListDomains(res.domains.map((d: any) => d.domain));
        } catch (e: any) {
          enqueueSnackbar("Failed to load custom domains: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
          console.log("failed to fetch domains", e);
        }
      } else {
        setListDomains([]);
      }
    };

    useEffect(() => {
      getDomains();
    }, [siteId]);

    return (
      <StyledSettingBlock id={SETTINGS_CONFIG.customDomains.anchor}>
        <StyledHeadSettingBlock>
          <StyledTitleBlock>
            {SETTINGS_CONFIG.customDomains.title}
            {!userIsReadOnly && (
              <SaveButton
                isEdit={isEdit}
                isLoading={isLoading}
                handleAction={handleClick}
              />
            )}
          </StyledTitleBlock>

          {userIsReadOnly && (
            <StyledDescriptionBlock color="red">
              Cannot view custom domains in read only mode
            </StyledDescriptionBlock>
          )}

          <StyledFormFields>
            {listDomains.length ? (
              listDomains.map((el, i) => (
                <ItemDomain
                  disabled={!isEdit}
                  siteId={siteId}
                  key={i}
                  domain={el}
                />
              ))
            ) : (
              <StyledDescriptionBlock>
                {SETTINGS_CONFIG.customDomains.description}
              </StyledDescriptionBlock>
            )}
          </StyledFormFields>
        </StyledHeadSettingBlock>

        <Button
          variant="contained"
          disabled={!isEdit}
          size="large"
          fullWidth
          onClick={handleOpenCustomDomain}
          endIcon={<PlusCircleIcon fontSize="inherit" />}
        >
          Add custom domain
        </Button>

        <CustomDomainForm
          onClose={handleCloseCustomDomain}
          isOpen={isOpenCustomDomain}
          siteId={siteId}
          updateWebSiteAddress={handleUpdateWebSiteAddress}
        />
      </StyledSettingBlock>
    );
  },
);

CustomDomains.displayName = "CustomDomains";
