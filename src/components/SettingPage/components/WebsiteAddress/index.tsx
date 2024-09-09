import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  StyledFormControl,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledSettingCol,
} from "@/components/SettingPage/styled";
import {
  InputLabel,
  OutlinedInput,
  Typography,
  CircularProgress,
  InputAdornment,
  Button,
} from "@mui/material";
import { SaveButton } from "@/components/SettingPage/components/SaveButton";
import { useEditSettingMode } from "@/hooks/useEditSettingMode";
import { IBaseSetting } from "@/types/setting.types";
import { HASH_CONFIG, NPUB_PRO_DOMAIN } from "@/consts";
import { debounce } from "lodash";
import { checkNpubProDomain } from "@/services/nostr/themes";
import { CustomDomainForm } from "../CustomDomainForm";

interface ITitleDescription extends IBaseSetting {
  url: string;
  siteId: string;
}

export const WebsiteAddress = ({
  url,
  siteId,
  handleChange,
  handleBlur,
  submitForm,
  isLoading,
}: ITitleDescription) => {
  const [isEdit, handleAction] = useEditSettingMode(submitForm, isLoading);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetchAddress, setFetchAddress] = useState(false);

  const handleClick = () => {
    if (error) return;
    handleAction().then();
    setDisabled((prev) => !prev);
  };

  const checkUrlExists = debounce(async (newUrl: string) => {
    setError(null);
    let newDomain = "";
    let oldDomain = "";
    try {
      const u = new URL(newUrl);
      newDomain = u.hostname;
      if (u.search) throw new Error("Only path is allowed");
      if (!u.pathname.endsWith("/")) throw new Error("Must end with /");
      if (u.hostname.endsWith("." + NPUB_PRO_DOMAIN) && u.pathname !== "/")
        throw new Error("Only / path is allowed on " + NPUB_PRO_DOMAIN);
    } catch (e: any) {
      console.log("Bad url", e);
      setError(e.toString());
      return;
    }

    try {
      const u = new URL(url);
      oldDomain = u.hostname;
    } catch {}

    if (newDomain === oldDomain || !newDomain.endsWith("." + NPUB_PRO_DOMAIN))
      return;

    const sub = newDomain.split("." + NPUB_PRO_DOMAIN)[0];
    if (!sub || sub.includes(".")) {
      setError("Bad sub domain");
      return;
    }

    setFetchAddress(true);
    const ok = await checkNpubProDomain(sub, siteId);
    setFetchAddress(false);

    if (!ok) {
      setError("This domain is already taken.");
    } else {
      setError(null);
    }
  }, 500);

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  const handleChangeWithDebounce = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (handleChange) {
      handleChange(event);
    }

    checkUrlExists(value);
  };

  return (
    <StyledSettingCol id={HASH_CONFIG.URL}>
      <StyledSettingBlock>
        <StyledHeadSettingBlock>
          <Typography variant="h6">Website address</Typography>

          <SaveButton
            isEdit={isEdit}
            isLoading={isLoading}
            handleAction={handleClick}
          />
        </StyledHeadSettingBlock>

        <StyledFormControl disabled={!isEdit} fullWidth size="small">
          <InputLabel htmlFor="url">URL</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="url"
            name="url"
            label="URL"
            onChange={handleChangeWithDebounce}
            value={url}
            onBlur={handleBlur}
            error={!!error}
            endAdornment={
              isFetchAddress ? (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ) : null
            }
          />
          {error && <Typography color="error">{error}</Typography>}
        </StyledFormControl>

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
          >
            Custom domain
          </Button>

          <CustomDomainForm />
        </StyledFormControl>
      </StyledSettingBlock>
    </StyledSettingCol>
  );
};
