"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
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
  StyledNotifyWhenLoading,
  StyledTitle,
} from "./styled";
import { Fragment, useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { validationSchemaDomain } from "@/validations/rules";
import {
  fetchCertDomain,
  fetchCertDomainStatus,
  fetchAttachDomain,
  fetchAttachDomainStatus,
} from "@/services/nostr/api";
import { ReadOnlyInput } from "./components/ReadOnlyInput";
import { DomainInfo, parseDomain } from "@/utils/web/domain-suffixes";
import { ArrowRightIcon, CrossIcon, CheckIcon } from "@/components/Icons";
import useResponsive from "@/hooks/useResponsive";

export const CustomDomainForm = ({
  siteId,
  updateWebSiteAddress,
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  siteId: string;
  onClose: () => void;
  updateWebSiteAddress: (url: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(false);
  const [stepForm, setStepForm] = useState<
    | "edit-dns"
    | "enter-domain"
    | "edit-dns-success"
    | "edit-dns-error"
    | "choose-options"
    | "success-edit-dns"
    | "choose-options-error"
  >("enter-domain");

  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

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
  } | null>(null);

  const [domainInfo, setDomainInfo] = useState<DomainInfo | undefined>();

  const handleChangeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOption((event.target as HTMLInputElement).value);
  };

  const contentRef = useRef<HTMLDivElement>(null);

  const {
    values: domainValues,
    submitForm: domainSubmitForm,
    handleChange: domainHandleChange,
    handleBlur: domainHandleBlur,
    errors: domainErrors,
  } = useFormik({
    initialValues: {
      domain: "",
    },
    validationSchema: validationSchemaDomain,
    onSubmit: async (values) => {
      setLoading(true);

      const info = parseDomain(values.domain);
      console.log("info", info);
      setDomainInfo(info);

      try {
        const res = await fetchCertDomain(values.domain);

        setDataDns(res);
        setStepForm("edit-dns");
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
      } finally {
        setLoading(false);
      }
    },
  });

  const [valueOption, setValueOption] = useState("");

  const handleSubmitDns = async () => {
    setLoading(true);

    const checkStatus = async () => {
      try {
        const res = await fetchCertDomainStatus(domainValues.domain);
        if (res.status !== "ISSUED") {
          setTimeout(checkStatus, 5000);
        } else {
          setStepForm("edit-dns-success");
          if (domainInfo!.isApex) setValueOption(`www.${domainValues.domain}`);
          else setValueOption(domainValues.domain);
          setLoading(false);

          enqueueSnackbar("Certificate ready", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
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
        setLoading(false);
      }
    };

    await checkStatus();
  };

  const handleSubmitOption = async () => {
    setLoading(true);

    const checkStatus = async () => {
      try {
        const res = await fetchAttachDomainStatus(domainValues.domain, siteId);
        if (res.status !== "Deployed") {
          setTimeout(checkStatus, 5000);
        } else {
          setStepForm("success-edit-dns");

          setLoading(false);

          enqueueSnackbar("Deployed", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });
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
        setLoading(false);
      }
    };

    await checkStatus();
  };

  const handleUpdateWebSiteAddress = () => {
    console.log("updateWebSiteAddress", valueOption);
    updateWebSiteAddress(valueOption);

    onClose();
  };

  const handleToFirstStep = () => {
    setStepForm("enter-domain");
  };

  const handleToChoiceOptions = async () => {
    setLoading(true);

    try {
      const res = await fetchAttachDomain(domainValues.domain, siteId);

      setRedirectionOptions(res);
      setStepForm("choose-options");
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
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  function renderDNS(
    dns: { name: string; value: string; type: string },
    i: number,
  ) {
    return (
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
  }

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
          {stepForm === "enter-domain" && (
            <>
              <FormControl
                fullWidth
                size={sizeField}
                disabled={isLoading}
                error={Boolean(domainErrors.domain)}
              >
                <InputLabel htmlFor="domain">Enter domain</InputLabel>

                <OutlinedInput
                  inputRef={inputRef}
                  id="domain"
                  name="domain"
                  disabled={isLoading}
                  label="Enter domain"
                  endAdornment={
                    isLoading ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : null
                  }
                  onChange={domainHandleChange}
                  value={domainValues.domain}
                  onBlur={domainHandleBlur}
                  error={!!domainErrors.domain}
                />

                {domainErrors.domain && (
                  <Typography variant="body2" color="error">
                    {domainErrors.domain}
                  </Typography>
                )}
              </FormControl>

              <LoadingButton
                fullWidth
                color="decorate"
                variant="contained"
                size="large"
                endIcon={<ArrowRightIcon fontSize="inherit" />}
                loading={isLoading}
                disabled={isLoading}
                onClick={() => domainSubmitForm()}
              >
                Continue
              </LoadingButton>
            </>
          )}

          {(stepForm === "edit-dns" ||
            stepForm === "edit-dns-success" ||
            stepForm === "edit-dns-error") && (
            <>
              <StyledDialogSubTitle>Update DNS settings</StyledDialogSubTitle>
              <StyledDialogSubDescription variant="body2">
                Please edit DNS records of <b>{domainInfo!.apex}</b>. We need
                this to make sure you own this domain and to issue SSL
                certificate.
              </StyledDialogSubDescription>

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

              {stepForm === "edit-dns" && (
                <>
                  <LoadingButton
                    fullWidth
                    color="decorate"
                    variant="contained"
                    size="large"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmitDns}
                    endIcon={<ArrowRightIcon fontSize="inherit" />}
                  >
                    I updated DNS records
                  </LoadingButton>

                  {isLoading && (
                    <StyledNotifyWhenLoading variant="body2">
                      Waiting for SSL certificate...
                    </StyledNotifyWhenLoading>
                  )}
                </>
              )}
              {stepForm === "edit-dns-error" && (
                <Alert
                  sx={{ justifyContent: "center" }}
                  icon={<CrossIcon fontSize="inherit" />}
                  severity="error"
                >
                  Failed, please retry
                </Alert>
              )}

              {stepForm === "edit-dns-success" && (
                <LoadingButton
                  fullWidth
                  color="decorate"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleToChoiceOptions}
                  endIcon={<ArrowRightIcon fontSize="inherit" />}
                >
                  Continue
                </LoadingButton>
              )}

              {stepForm === "edit-dns-error" && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  variant="contained"
                  size="medium"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleToFirstStep}
                >
                  Go to first step to retry
                </LoadingButton>
              )}
            </>
          )}

          {(stepForm === "choose-options" ||
            stepForm === "choose-options-error") && (
            <>
              {domainInfo!.isApex && (
                <>
                  <StyledDialogSubTitle>
                    Choose main address
                  </StyledDialogSubTitle>
                  <StyledDialogSubDescription variant="body2">
                    Main site address will be used as canonical, and the
                    alternative name will be redirected to the main address.
                  </StyledDialogSubDescription>

                  <Box>
                    <Chip
                      sx={{ marginBottom: "8px" }}
                      size="small"
                      label="Recommended"
                      color="default"
                    />

                    <FormControl sx={{ paddingLeft: "0px" }}>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={valueOption}
                        onChange={handleChangeOption}
                      >
                        <FormControlLabel
                          color="info"
                          disabled={isLoading}
                          value={`www.${domainValues.domain}`}
                          control={<Radio />}
                          label={`www.${domainValues.domain}`}
                        />
                        <StyledDialogSubDescription
                          sx={{ mb: "16px", marginTop: "8px" }}
                          variant="body2"
                        >
                          Supported by all DNS providers
                        </StyledDialogSubDescription>
                        <FormControlLabel
                          disabled={isLoading}
                          value={domainValues.domain}
                          control={<Radio />}
                          label={domainValues.domain}
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
                      name:
                        `www.${domainValues.domain}` === valueOption
                          ? "www"
                          : "",
                      value: redirectionOptions!.cnameDomain!,
                    },
                    0,
                  )}
                  <Divider />
                  {renderDNS(
                    {
                      type: "A",
                      name:
                        `www.${domainValues.domain}` === valueOption
                          ? ""
                          : "www",
                      value: redirectionOptions!.redirectIps[0]!,
                    },
                    1,
                  )}
                </>
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

              {stepForm === "choose-options-error" && (
                <Alert
                  sx={{ justifyContent: "center" }}
                  icon={<CrossIcon fontSize="inherit" />}
                  severity="error"
                >
                  Failed, please retry
                </Alert>
              )}

              <FormControl fullWidth size="medium">
                {stepForm === "choose-options-error" ? (
                  <LoadingButton
                    fullWidth
                    color="primary"
                    variant="contained"
                    size="medium"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleToFirstStep}
                  >
                    Go to first step to retry
                  </LoadingButton>
                ) : (
                  <>
                    <LoadingButton
                      fullWidth
                      color="decorate"
                      variant="contained"
                      size="large"
                      loading={isLoading}
                      disabled={isLoading}
                      endIcon={<ArrowRightIcon />}
                      onClick={handleSubmitOption}
                    >
                      I updated DNS settings
                    </LoadingButton>
                  </>
                )}
              </FormControl>

              {isLoading && (
                <StyledNotifyWhenLoading variant="body2">
                  Waiting for deployment up to 60 seconds...
                </StyledNotifyWhenLoading>
              )}
            </>
          )}

          {stepForm === "success-edit-dns" && (
            <>
              <Alert
                icon={<CheckIcon fontSize="inherit" />}
                severity="success"
                sx={{ justifyContent: "center" }}
              >
                DNS settings are correct
              </Alert>

              <FormControl fullWidth size="medium">
                <LoadingButton
                  fullWidth
                  color="decorate"
                  variant="contained"
                  size="large"
                  onClick={handleUpdateWebSiteAddress}
                >
                  Update website address
                </LoadingButton>
              </FormControl>
            </>
          )}
        </StyledDialogContent>
      </Box>
    </StyledDialog>
  );
};
