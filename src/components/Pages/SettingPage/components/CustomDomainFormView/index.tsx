"use client";

import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogSubDescription,
  StyledDialogSubTitle,
  StyledDialogTitle,
  StyledTitle,
} from "./styled";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import {
  fetchCertDomainStatus,
  fetchAttachDomainStatus,
} from "@/services/nostr/api";
import { DomainInfo, parseDomain } from "@/utils/web/domain-suffixes";
import { ArrowRightIcon, CrossIcon, CheckIcon } from "@/components/Icons";
import { ReadOnlyInput } from "../CustomDomainForm/components/ReadOnlyInput";
import { SpinerCircularProgress } from "@/components/Spiner";

const ERROR_MESSAGE_INITIAL = "Failed, please retry";

export const CustomDomainFormView = ({
  siteId,
  isOpen,
  onClose,
  domain,
}: {
  isOpen: boolean;
  siteId: string;
  domain: string;
  onClose: () => void;
}) => {
  const [isLoading, setLoading] = useState(false);
  const [valueOption, setValueOption] = useState("");
  const [errorMessage, setErrorMessage] = useState(ERROR_MESSAGE_INITIAL);

  const [stepForm, setStepForm] = useState<
    | "edit-dns"
    | "start"
    | "edit-dns-success"
    | "edit-dns-error"
    | "choose-options"
    | "success-edit-dns"
    | "choose-options-success"
    | "choose-options-error"
  >("start");

  const [dataDns, setDataDns] = useState<{
    domain: string;
    status: string;
    dnsValidation: {
      type: string;
      name: string;
      value: string;
    }[];
  } | null>(null);

  const [redirectionOptions, setRedirectionOptions] = useState<{
    cnameDomain: string;
    redirectIps: string[];
    status: string;
    www: boolean;
  } | null>(null);

  const [domainInfo, setDomainInfo] = useState<DomainInfo | undefined>();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToChoiceOptions = async () => {
    setLoading(true);

    try {
      const res = await fetchAttachDomainStatus(domain, siteId);

      setRedirectionOptions(res);
      setStepForm("choose-options-success");
      if (res.status !== "Deployed") {
        setErrorMessage(`Status: ${res.status}`);
      }
      if (res?.www) {
        setValueOption(`www.${domain}`);
      }
    } catch (e: any) {
      console.log(e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      setStepForm("choose-options-error");
      setErrorMessage(ERROR_MESSAGE_INITIAL);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = useCallback(async (domainValue: string) => {
    setLoading(true);
    const info = parseDomain(domainValue);
    console.log("info", info);
    setDomainInfo(info);

    try {
      const res = await fetchCertDomainStatus(domainValue);

      setDataDns(res);
      if (res.status !== "ISSUED") {
        // setTimeout(checkStatus, 5000);
        setStepForm("edit-dns-error");
        setErrorMessage(`Status: ${res.status}`);
      } else {
        setStepForm("edit-dns-success");
        if (info!.isApex) {
          setValueOption(`www.${domainValue}`);
        } else {
          if (domainValue.split(".").includes("www")) {
            setValueOption(`www.${domainValue}`);
          } else {
            setValueOption(domainValue);
          }
        }
      }
    } catch (e: any) {
      console.log(e);
      enqueueSnackbar("Error: " + e.toString(), {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      setStepForm("edit-dns-error");
      setErrorMessage(ERROR_MESSAGE_INITIAL);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (domain && isOpen) {
      checkStatus(domain);
    }
  }, [domain, isOpen, checkStatus]);

  useEffect(() => {
    if (
      (contentRef.current && isLoading) ||
      (contentRef.current && stepForm === "edit-dns-success")
    ) {
      contentRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }

    if (contentRef.current && stepForm === "choose-options" && !isLoading) {
      contentRef.current.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [contentRef, isLoading, stepForm]);

  const renderDNS = (
    dns: { name: string; value: string; type: string },
    i: number,
  ) => (
    <Fragment key={i}>
      <StyledDialogSubTitle>DNS record #{i + 1}</StyledDialogSubTitle>

      <ReadOnlyInput label="Type" value={dns.type} />

      {dns.name && <ReadOnlyInput label="Name" value={dns.name} />}

      {!dns.name && (
        <ReadOnlyInput
          isHideCopy
          label="Name"
          value="&lt;Leave blank or use @&gt;"
        />
      )}

      <ReadOnlyInput label="Value" value={dns.value} />
    </Fragment>
  );

  return (
    <StyledDialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box ref={contentRef}>
        <StyledDialogTitle>
          <StyledTitle variant="body1">Custom domain</StyledTitle>

          <Button
            onClick={onClose}
            variant="text"
            color="secondary"
            sx={{ minWidth: "auto" }}
          >
            <CrossIcon color="inherit" />
          </Button>
        </StyledDialogTitle>

        <StyledDialogContent>
          {stepForm === "start" && <SpinerCircularProgress />}
          {(stepForm === "edit-dns" ||
            stepForm === "edit-dns-success" ||
            stepForm === "edit-dns-error") && (
            <>
              {dataDns &&
                dataDns.dnsValidation.map((dns, i) => (
                  <>
                    {renderDNS(
                      {
                        ...dns,
                        name: domainInfo!.isApex
                          ? dns.name
                          : [dns.name, domainInfo!.sub]
                              .filter((s) => !!s)
                              .join("."),
                      },
                      i,
                    )}
                    {dataDns.dnsValidation.length !== i + 1 && <Divider />}
                  </>
                ))}

              {stepForm === "edit-dns-success" && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ justifyContent: "center" }}
                >
                  SSL certificate is ready!
                </Alert>
              )}

              {stepForm === "edit-dns-error" && (
                <Alert
                  sx={{ justifyContent: "center" }}
                  icon={<CrossIcon fontSize="inherit" />}
                  severity="error"
                >
                  {errorMessage}
                </Alert>
              )}

              <LoadingButton
                fullWidth
                color="decorate"
                variant="contained"
                size="large"
                loading={isLoading}
                disabled={isLoading || stepForm === "edit-dns-error"}
                endIcon={<ArrowRightIcon fontSize="inherit" />}
                onClick={handleToChoiceOptions}
              >
                Continue
              </LoadingButton>
            </>
          )}

          {(stepForm === "choose-options" ||
            stepForm === "choose-options-error" ||
            stepForm === "choose-options-success") && (
            <>
              {domainInfo!.isApex && (
                <>
                  <StyledDialogSubTitle>Main address</StyledDialogSubTitle>
                  <StyledDialogSubDescription variant="body2">
                    Main site address will be used as canonical, and the
                    alternative name will be redirected to the main address.
                  </StyledDialogSubDescription>

                  <Box>
                    <FormControl sx={{ paddingLeft: "0px" }} disabled>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={valueOption}
                      >
                        <FormControlLabel
                          color="info"
                          disabled
                          value={`www.${domain}`}
                          control={<Radio />}
                          label={`www.${domain}`}
                        />
                        <StyledDialogSubDescription
                          sx={{ mb: "16px", marginTop: "8px" }}
                          variant="body2"
                        >
                          Supported by all DNS providers
                        </StyledDialogSubDescription>
                        <FormControlLabel
                          disabled
                          value={domain}
                          control={<Radio />}
                          label={domain}
                        />
                        <StyledDialogSubDescription
                          sx={{ marginTop: "8px" }}
                          variant="body2"
                        >
                          Supported by limited number of DNS providers
                        </StyledDialogSubDescription>
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {renderDNS(
                    {
                      type: "CNAME",
                      name: `www.${domain}` === valueOption ? "www" : "",
                      value: redirectionOptions!.cnameDomain!,
                    },
                    0,
                  )}
                  <Divider />
                  {renderDNS(
                    {
                      type: "A",
                      name: `www.${domain}` === valueOption ? "" : "www",
                      value: redirectionOptions!.redirectIps[0]!,
                    },
                    1,
                  )}
                </>
              )}

              {stepForm === "choose-options-success" && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ justifyContent: "center" }}
                >
                  DNS ready!
                </Alert>
              )}

              {stepForm === "choose-options-error" && (
                <Alert
                  sx={{ justifyContent: "center" }}
                  icon={<CrossIcon fontSize="inherit" />}
                  severity="error"
                >
                  {errorMessage}
                </Alert>
              )}

              {!domainInfo!.isApex && (
                <>
                  <Typography sx={{ mb: 1 }} variant="h6">
                    Almost done
                  </Typography>
                  <Typography sx={{ mb: 1, maxWidth: "400px" }} variant="body2">
                    Your SSL certificate is issued, set these DNS records to
                    start serving your site on <b>{domainInfo!.domain}</b>.
                  </Typography>
                  {renderDNS(
                    {
                      type: "CNAME",
                      name: domainInfo!.sub,
                      value: redirectionOptions!.cnameDomain!,
                    },
                    0,
                  )}
                  <Typography sx={{ mb: 1, maxWidth: "400px" }} variant="body2">
                    Make sure to remove other CNAME and A records for this name,
                    if they existed.
                  </Typography>
                </>
              )}
            </>
          )}
        </StyledDialogContent>
      </Box>
    </StyledDialog>
  );
};
