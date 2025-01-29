import { useFormik } from "formik";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
  StyledVideo,
} from "../../../styled";
import { enqueueSnackbar } from "notistack";
import useResponsive from "@/hooks/useResponsive";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ArrowRightIcon, ChevronLeftIcon, KeyIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";

const initialValues: { npub: string } = {
  npub: "",
};

export const LoginDM = ({ showEnterCode }: { showEnterCode: () => void }) => {
  const [isLoading, setLoading] = useState(false);
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const router = useRouter();

  const { values, submitForm, handleChange, handleBlur } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);

        showEnterCode();

        enqueueSnackbar("Your code is incorrect, please try again", {
          autoHideDuration: 3000,
          variant: "warning",
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
      }, 3000);
    },
  });

  const handleSubmit = () => {
    submitForm();
  };

  const startIconCreate = isLoading ? (
    <CircularProgress size={16} color="inherit" />
  ) : undefined;

  const handleCreate = isLoading ? undefined : handleSubmit;

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <StyledTitlePage>Log in with DM</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Please enter your user name or npub, and we will send you a direct
        message with a one-time code.
      </StyledDescriptionPage>

      <StyledVideo>
        <video width="300" autoPlay loop muted>
          <source src={"/video/1.mp4"} type="video/mp4" />
        </video>
      </StyledVideo>

      <FormControl fullWidth size={sizeField}>
        <InputLabel htmlFor="npub">Npub account</InputLabel>
        <OutlinedInput
          id="npub"
          name="npub"
          label="Npub account"
          onChange={handleChange}
          value={values.npub}
          onBlur={handleBlur}
        />
      </FormControl>

      <Button
        fullWidth
        disabled={isLoading ? false : !values.npub.length}
        size="large"
        color="decorate"
        variant="contained"
        endIcon={<ArrowRightIcon />}
        startIcon={startIconCreate}
        onClick={handleCreate}
      >
        Send code
      </Button>

      <StyledActions>
        <Button
          size="small"
          color="decorate"
          variant="text"
          startIcon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="small"
          color="decorate"
          variant="text"
          startIcon={<KeyIcon />}
        >
          Advanced
        </Button>
      </StyledActions>
    </>
  );
};
