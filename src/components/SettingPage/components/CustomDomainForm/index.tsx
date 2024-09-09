"use client";

import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
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

export const CustomDomainForm = () => {
  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(false);
  const [stepForm, setStepForm] = useState<
    | "edit-dns"
    | "enter-domain"
    | "edit-dns-success"
    | "choose-options"
    | "success-edit-dns"
  >("enter-domain");

  const [dataDns, setDataDns] = useState<
    {
      domain: string;
      status: string;
      dnsValidation: {
        type: string;
        name: string;
        value: string;
      }[];
    }[]
  >([]);

  const [valueOption, setValueOption] = useState("www.domain.com");

  const handleChangeOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueOption((event.target as HTMLInputElement).value);
  };

  const handleCancel = () => {
    setOpen(false);
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

      console.log({ values });

      try {
        setTimeout(() => {
          enqueueSnackbar("Success!", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "right",
              vertical: "bottom",
            },
          });

          setStepForm("edit-dns");
          setDataDns([
            {
              domain: "nostrband.com",
              status: "ISSUED",
              dnsValidation: [
                {
                  type: "TXT",
                  name: "",
                  value:
                    "nostr-admin-pubkey=3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd",
                },
                {
                  type: "CNAME",
                  name: "_fc61b382f79fa8ee55ba2063e3a52bca",
                  value:
                    "_419319d4a42c0b10387c2d25ed968424.djqtsrsxkq.acm-validations.aws.",
                },
              ],
            },
          ]);
        }, 2000);
      } catch (e: any) {
        enqueueSnackbar("Error: " + e.toString(), {
          autoHideDuration: 3000,
          variant: "error",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    },
  });

  const handleSubmitDns = async () => {
    setLoading(true);

    try {
      setTimeout(() => {
        enqueueSnackbar("Success!", {
          autoHideDuration: 3000,
          variant: "success",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });

        setStepForm("edit-dns-success");
      }, 2000);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleSubmitOption = async () => {
    setLoading(true);

    try {
      setTimeout(() => {
        enqueueSnackbar("Success!", {
          autoHideDuration: 3000,
          variant: "success",
          anchorOrigin: {
            horizontal: "right",
            vertical: "bottom",
          },
        });

        setStepForm("success-edit-dns");
      }, 2000);
    } catch (error) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleToChoiceOptions = () => {
    setStepForm("choose-options");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
      setDataDns([
        {
          domain: "nostrband.com",
          status: "ISSUED",
          dnsValidation: [
            {
              type: "TXT",
              name: "",
              value:
                "nostr-admin-pubkey=3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd",
            },
            {
              type: "CNAME",
              name: "_fc61b382f79fa8ee55ba2063e3a52bca",
              value:
                "_419319d4a42c0b10387c2d25ed968424.djqtsrsxkq.acm-validations.aws.",
            },
          ],
        },
      ]);
    }, 500);
  }, []);

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
            onClick={handleCancel}
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
                <Typography color="error">{domainErrors.domain}</Typography>
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

        {(stepForm === "edit-dns" || stepForm === "edit-dns-success") && (
          <StyledDialogContentTable>
            <Typography sx={{ mb: 1 }} variant="h5">
              Update DNS settings
            </Typography>
            <Typography sx={{ mb: 1, maxWidth: "400px" }} variant="body2">
              Edit DNS records of domain XXX to verify domain ownership to issue
              SSL certificate дальше таблица с записями из dnsValidation.
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Domain</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataDns.map((dns) => (
                    <TableRow
                      key={dns.domain}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {dns.domain}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={dns.status}
                          color="decorate"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {stepForm === "edit-dns-success" && (
              <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                Certificate ready
              </Alert>
            )}

            <StyledFormControl fullWidth size="medium">
              {stepForm === "edit-dns" && (
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
            </StyledFormControl>
          </StyledDialogContentTable>
        )}

        {stepForm === "choose-options" && (
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
                  value="www.domain.com"
                  control={<Radio />}
                  label={
                    <>
                      www.domain.com{" "}
                      <Chip size="small" label="Recomendet" color="decorate" />
                    </>
                  }
                />
                <Typography sx={{ mb: 1 }} variant="body2">
                  Supported by all DNS providers
                </Typography>
                <FormControlLabel
                  value="domain.com"
                  control={<Radio />}
                  label="domain.com"
                />
                <Typography sx={{ mb: 1 }} variant="body2">
                  Supported by limited number of DNS providers
                </Typography>
              </RadioGroup>
            </FormControl>

            <TableContainer component={Paper} elevation={0}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Domain</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataDns.map((dns) => (
                    <TableRow
                      key={dns.domain}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {dns.domain}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={dns.status}
                          color="decorate"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <StyledFormControl fullWidth size="medium">
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
              Success edit DNS
            </Alert>

            <StyledFormControl fullWidth size="medium">
              <LoadingButton
                fullWidth
                color="primary"
                variant="contained"
                size="medium"
                loading={isLoading}
                disabled={isLoading}
              >
                Open website
              </LoadingButton>
            </StyledFormControl>
          </StyledDialogContentTable>
        )}
      </DialogTitle>
    </Dialog>
  );
};
