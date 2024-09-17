"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  StyledDialogContent,
  StyledDialogContentTable,
  StyledFormControl,
  StyledTitle,
} from "./styled";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { validationSchemaDomain } from "@/validations/rules";
import CheckIcon from "@mui/icons-material/Check";
import {
  fetchCertDomain,
  fetchCertDomainStatus,
  fetchDNS,
  fetchDNSStatus,
} from "@/services/nostr/api";
import { ReadOnlyInput } from "./components/ReadOnlyInput";

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

  const handleChangeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOption((event.target as HTMLInputElement).value);
  };

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

  const [valueOption, setValueOption] = useState(`www.${domainValues.domain}`);

  const handleSubmitDns = async () => {
    setLoading(true);

    const checkStatus = async () => {
      try {
        const res = await fetchCertDomainStatus(domainValues.domain);
        if (res.status !== "ISSUED") {
          setTimeout(checkStatus, 5000);
        } else {
          setStepForm("edit-dns-success");
          setValueOption(`www.${domainValues.domain}`);
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
        const res = await fetchDNSStatus(domainValues.domain, siteId);
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
    updateWebSiteAddress(valueOption);

    onClose();
  };

  const handleToFirstStep = () => {
    setStepForm("enter-domain");
  };

  const handleToChoiceOptions = async () => {
    setLoading(true);

    try {
      const res = await fetchDNS(domainValues.domain, siteId);

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
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle component="div" id="alert-dialog-title">
        <StyledTitle variant="body1">
          Custom domain
          <Fab
            onClick={onClose}
            size="small"
            color="primary"
            aria-label="close"
          >
            <CloseIcon />
          </Fab>
        </StyledTitle>

        {stepForm === "enter-domain" && (
          <StyledDialogContent>
            <StyledFormControl
              fullWidth
              size="small"
              disabled={isLoading}
              error={Boolean(domainErrors.domain)}
            >
              <InputLabel htmlFor="domain">Enter domain</InputLabel>
              <OutlinedInput
                inputRef={inputRef}
                id="domain"
                name="domain"
                disabled={isLoading}
                label="Enter domai"
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
            </StyledFormControl>
            <StyledFormControl fullWidth size="medium">
              <LoadingButton
                fullWidth
                color="primary"
                variant="contained"
                size="medium"
                loading={isLoading}
                disabled={isLoading}
                onClick={() => domainSubmitForm()}
              >
                Continue
              </LoadingButton>
            </StyledFormControl>{" "}
          </StyledDialogContent>
        )}

        {(stepForm === "edit-dns" ||
          stepForm === "edit-dns-success" ||
          stepForm === "edit-dns-error") && (
          <StyledDialogContentTable>
            <Typography sx={{ mb: 1 }} variant="h5">
              Update DNS settings
            </Typography>
            <Typography sx={{ mb: 1, maxWidth: "400px" }} variant="body2">
              Edit DNS records of domain XXX to verify domain ownership to issue
              SSL certificate
            </Typography>

            {dataDns &&
              dataDns.dnsValidation.map((dns, i) => (
                <Box key={i} sx={{ mb: 5 }}>
                  <Typography variant="body1">
                    <b>
                      {" "}
                      DNS:
                      {i + 1}
                    </b>
                  </Typography>

                  <Typography
                    sx={{
                      mb: 1,
                      pb: 2,
                      pt: 2,
                      borderBottom: "1px dashed #000",
                      alignItems: "end",
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "400px",
                    }}
                    variant="body2"
                  >
                    <span>Type</span>
                    {dns.type}
                  </Typography>

                  <Typography
                    sx={{
                      mb: 1,
                      pb: 2,
                      pt: 2,
                      borderBottom: "1px dashed #000",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "400px",
                    }}
                    variant="body2"
                  >
                    <span>Name</span>
                    {Boolean(dns.name) ? (
                      <ReadOnlyInput value={dns.name} />
                    ) : (
                      "-"
                    )}
                  </Typography>

                  <Typography
                    sx={{
                      mb: 1,
                      pb: 2,
                      pt: 2,
                      borderBottom: "1px dashed #000",
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "space-between",
                      width: "100%",
                      maxWidth: "400px",
                    }}
                    variant="body2"
                  >
                    <span>Value</span>
                    <ReadOnlyInput value={dns.value} />
                  </Typography>
                </Box>
              ))}

            {stepForm === "edit-dns-success" && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Certificate ready
              </Alert>
            )}

            <StyledFormControl fullWidth size="medium">
              {stepForm === "edit-dns" && (
                <>
                  <LoadingButton
                    fullWidth
                    color="primary"
                    variant="contained"
                    size="medium"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={handleSubmitDns}
                  >
                    I edit dns
                  </LoadingButton>
                  {isLoading && (
                    <Typography
                      sx={{
                        marginTop: 1,
                        textAlign: "center",
                        color: "#cd1fa6",
                      }}
                      variant="body2"
                    >
                      Waiting for validation
                    </Typography>
                  )}
                </>
              )}
              {stepForm === "edit-dns-success" && (
                <LoadingButton
                  fullWidth
                  color="primary"
                  variant="contained"
                  size="medium"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleToChoiceOptions}
                >
                  Continue
                </LoadingButton>
              )}
              {stepForm === "edit-dns-error" && (
                <Alert
                  sx={{ marginBottom: 1 }}
                  icon={<CloseIcon fontSize="inherit" />}
                  severity="error"
                >
                  Failed, please retry
                </Alert>
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
            </StyledFormControl>
          </StyledDialogContentTable>
        )}

        {(stepForm === "choose-options" ||
          stepForm === "choose-options-error") && (
          <StyledDialogContentTable>
            <Typography sx={{ mb: 1 }} variant="h6">
              Choose redirection options
            </Typography>

            <FormControl sx={{ paddingLeft: "15px" }}>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={valueOption}
                onChange={handleChangeOption}
              >
                <FormControlLabel
                  disabled={isLoading}
                  value={`www.${domainValues.domain}`}
                  control={<Radio />}
                  label={
                    <>
                      {`www.${domainValues.domain}`}
                      <Chip
                        sx={{ marginLeft: 1 }}
                        size="small"
                        label="Recomendet"
                        color="decorate"
                      />
                    </>
                  }
                />
                <Typography sx={{ mb: 1 }} variant="body2">
                  Supported by all DNS providers
                </Typography>
                <FormControlLabel
                  disabled={isLoading}
                  value={domainValues.domain}
                  control={<Radio />}
                  label={domainValues.domain}
                />
                <Typography sx={{ mb: 1 }} variant="body2">
                  Supported by limited number of DNS providers
                </Typography>
              </RadioGroup>
            </FormControl>

            <Box>
              <Button color="info" href="#">
                Learn more
              </Button>
            </Box>

            <Typography
              sx={{
                mb: 1,
                pb: 2,
                pt: 2,
                borderBottom: "1px dashed #000",
                alignItems: "end",
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "400px",
              }}
              variant="body2"
            >
              <span>
                {" "}
                {`www.${domainValues.domain}` === valueOption
                  ? "CNAME"
                  : "CNAME/ALIAS/ANAME"}
              </span>
              A
            </Typography>

            <Typography
              sx={{
                mb: 1,
                pb: 2,
                pt: 2,
                borderBottom: "1px dashed #000",
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "400px",
              }}
              variant="body2"
            >
              <span>
                {" "}
                {`www.${domainValues.domain}` === valueOption ? "www" : "@"}
              </span>
              {`www.${domainValues.domain}` === valueOption ? "@" : "www"}
            </Typography>

            <Typography
              sx={{
                mb: 1,
                pb: 2,
                pt: 2,
                borderBottom: "1px dashed #000",
                display: "flex",
                alignItems: "end",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "400px",
              }}
              variant="body2"
            >
              <span>cnameDomain</span>
              {redirectionOptions?.redirectIps.join(" ")}
            </Typography>

            {stepForm === "choose-options-error" && (
              <Alert
                sx={{ marginBottom: 1 }}
                icon={<CloseIcon fontSize="inherit" />}
                severity="error"
              >
                Failed, please retry
              </Alert>
            )}

            <StyledFormControl fullWidth size="medium">
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
                <LoadingButton
                  fullWidth
                  color="primary"
                  variant="contained"
                  size="medium"
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleSubmitOption}
                >
                  I write
                </LoadingButton>
              )}
            </StyledFormControl>
          </StyledDialogContentTable>
        )}

        {stepForm === "success-edit-dns" && (
          <StyledDialogContentTable>
            <Alert
              sx={{ width: "250px" }}
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
            >
              DNS settings are correct
            </Alert>

            <StyledFormControl fullWidth size="medium">
              <LoadingButton
                fullWidth
                color="primary"
                variant="contained"
                size="medium"
                onClick={handleUpdateWebSiteAddress}
              >
                Update website address
              </LoadingButton>
            </StyledFormControl>
          </StyledDialogContentTable>
        )}
      </DialogTitle>
    </Dialog>
  );
};
