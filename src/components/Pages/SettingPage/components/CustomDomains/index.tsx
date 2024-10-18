"use client";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "../../styled";
import { Typography, Button, Box } from "@mui/material";
import { SaveButton } from "../SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG } from "@/consts";
import { CustomDomainForm } from "../CustomDomainForm";
import { fetchDomains } from "@/services/nostr/api";
import { enqueueSnackbar } from "notistack";
import { userIsReadOnly } from "@/services/nostr/nostr";

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
      <StyledSettingCol id={HASH_CONFIG.CUSTOM_DOMAINS}>
        <StyledSettingBlock>
          <StyledHeadSettingBlock>
            <Typography variant="h6">Custom domains</Typography>

            {!userIsReadOnly && (
              <SaveButton
                isEdit={isEdit}
                isLoading={isLoading}
                handleAction={handleClick}
              />
            )}
          </StyledHeadSettingBlock>

          {userIsReadOnly && (
            <Typography variant="body2" color={"red"}>
              Cannot view custom domains in read only mode
            </Typography>
          )}

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
                You do not have custom domains yet.
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
  },
);

CustomDomains.displayName = "CustomDomains";
