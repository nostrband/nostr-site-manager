import React, { memo, useEffect, useRef, useState } from "react";
import {
  StyledDescriptionBlock,
  StyledFormFields,
  StyledHeadSettingBlock,
  StyledSettingBlock,
  StyledTitleBlock,
} from "../../styled";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { SaveButton } from "../SaveButton";
import { SETTINGS_CONFIG } from "@/consts";
import { editNostrJson, fetchNostrJson } from "@/services/nostr/files";
import { enqueueSnackbar } from "notistack";

interface NostrJsonProps {
  siteId: string
  isLoading: boolean
}

export const NostrJson = memo(({ siteId, isLoading: isSideLoading }: NostrJsonProps) => {
  const [isLoading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isError, setError] = useState(false);
  const [value, setValue] = useState("");
  const [valueOriginal, setValueOriginal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);

  const isEdited = !_.isEqual(value, valueOriginal);

  const isValidJson = (input: string) => {
    try {
      if (input) JSON.parse(input);
      setError(false);
    } catch {
      setError(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleAction = async () => {
    if (!isError) {
      if (isEdited) {
        setLoading(true);

        try {
          await editNostrJson(siteId, value);

          setValueOriginal(value);
          setEdit(false);
        } catch (e: any) {
          enqueueSnackbar("Error: " + e.toString(), {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
        }

        setLoading(false);
      } else {
        if (isEdit) {
          setEdit(false);
          setDisabled(false);
        } else {
          setEdit(true);
          setDisabled(true);
        }
      }
    }
  };

  const formateString = (str: string) => {
    const parsed = JSON.parse(str);
    const formatted = JSON.stringify(parsed, null, 2);
    return formatted;
  };

  const handleFormate = () => {
    if (!isError) {
      setValue(formateString(value));
    }
  };

  const handleReset = () => {
    setValue(valueOriginal);
  };

  useEffect(() => {
    setLoading(true);

    if (siteId) {
      fetchNostrJson(siteId)
        .then((content) => {
          if (content) {
            setValue(formateString(content));
            setValueOriginal(formateString(content));
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [siteId]);

  useEffect(() => {
    if (inputRef.current && isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    isValidJson(value);
  }, [value]);

  return (
    <StyledSettingBlock id={SETTINGS_CONFIG.nostrJson.anchor}>
      <StyledHeadSettingBlock>
        <StyledTitleBlock>
          {SETTINGS_CONFIG.nostrJson.title}
          <SaveButton
            isEdit={isEdit || isSideLoading}
            isLoading={isLoading || isSideLoading}
            handleAction={handleAction}
          />
        </StyledTitleBlock>

        <StyledDescriptionBlock>
          {SETTINGS_CONFIG.nostrJson.description}
        </StyledDescriptionBlock>
      </StyledHeadSettingBlock>

      <StyledFormFields>
        <FormControl disabled={!isEdit || isSideLoading} fullWidth size="small" error={isError}>
          <InputLabel htmlFor="nostr_json">Nostr.json file content</InputLabel>
          <OutlinedInput
            inputRef={inputRef}
            id="nostr_json"
            name="nostr_json"
            label="Nostr.json file content"
            multiline
            rows={6}
            error={isError}
            onChange={handleChange}
            value={value}
          />
        </FormControl>

        {isError && (
          <Typography variant="body2" color="error">
            JSON is not valid
          </Typography>
        )}

        {isEdit && (
          <Box>
            <Button onClick={handleFormate} size="small">
              Format JSON
            </Button>
            {isEdited && (
              <Button onClick={handleReset} size="small">
                Reset changes
              </Button>
            )}
          </Box>
        )}
      </StyledFormFields>
    </StyledSettingBlock>
  );
});

NostrJson.displayName = "NostrJson";
