import { useFormik } from "formik";
import {
  StyledActions,
  StyledDescriptionPage,
  StyledTitlePage,
  StyledVideo,
} from "../../../styled";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { ArrowRightIcon, ChevronLeftIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import OTPInput from "@/components/OTPInput";
import { OTP_LENGTH } from "@/consts";

const initialValues: { code: string } = {
  code: "",
};

export const LoginEnterCode = ({
  showLoginDM,
}: {
  showLoginDM: () => void;
}) => {
  const [isLoading, setLoading] = useState(false);
  const [isFirstSend, setFirstSend] = useState(false);

  const router = useRouter();

  const { values, submitForm, setFieldValue } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      if (isFirstSend) {
        setLoading(true);

        setTimeout(() => {
          setLoading(false);

          router.push("/onboarding/create-site");

          enqueueSnackbar("Log in success!", {
            autoHideDuration: 3000,
            variant: "success",
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
        }, 3000);
      } else {
        setLoading(true);

        setTimeout(() => {
          setLoading(false);

          setFirstSend(true);

          enqueueSnackbar("Your code is incorrect, please try again", {
            autoHideDuration: 3000,
            variant: "warning",
            anchorOrigin: {
              horizontal: "left",
              vertical: "bottom",
            },
          });
        }, 3000);
      }
    },
  });

  const handleSubmit = () => {
    submitForm();
  };

  const startIconLogin = isLoading ? (
    <CircularProgress size={16} color="inherit" />
  ) : undefined;

  const handleLogin = isLoading ? undefined : handleSubmit;

  const handleChangeOtp = (value: string) => {
    setFieldValue("code", value);

    if (value.length === OTP_LENGTH) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    showLoginDM();
  };

  return (
    <>
      <StyledTitlePage>Enter your code</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        We have sent you a 6 significant code to your Nostr app.
      </StyledDescriptionPage>

      <StyledVideo>
        <video width="300" autoPlay loop muted>
          <source src={"/video/2.mp4"} type="video/mp4" />
        </video>
      </StyledVideo>

      <OTPInput name="code" length={OTP_LENGTH} onChange={handleChangeOtp} />

      <Button
        fullWidth
        disabled={isLoading ? false : values.code.length !== OTP_LENGTH}
        size="large"
        color="decorate"
        variant="contained"
        endIcon={<ArrowRightIcon />}
        startIcon={startIconLogin}
        onClick={handleLogin}
      >
        Log in
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
        <Button size="small" color="decorate" variant="text">
          Resend the code
        </Button>
      </StyledActions>
    </>
  );
};
