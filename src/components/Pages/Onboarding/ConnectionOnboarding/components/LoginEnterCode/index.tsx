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
import OTPInput from "@/components/OTPInput";
import { OTP_LENGTH } from "@/consts";
import axios from "axios";
import { loginOTP } from "@/services/nostr/onboard";
import { useRouter } from "next/navigation";

const initialValues: { code: string } = {
  code: "",
};

export const LoginEnterCode = ({
  showLoginDM,
  pubkey,
}: {
  showLoginDM: () => void;
  pubkey: string;
}) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const { values, submitForm, setFieldValue } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      setLoading(true);

      const { code } = values;

      try {
        const otpData = await axios.get(
          `https://api.npubpro.com/authotp?pubkey=${pubkey}&code=${code}`,
        );
        await loginOTP(pubkey, otpData.data);
        router.push("/onboarding/create-site");
      } catch (e) {
        enqueueSnackbar("Your code is incorrect, please try again", {
          autoHideDuration: 3000,
          variant: "warning",
          anchorOrigin: {
            horizontal: "left",
            vertical: "bottom",
          },
        });
      } finally {
        setLoading(false);
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

  const handleResetCode = async () => {
    try {
      handleChangeOtp("");
      await axios.get(`https://api.npubpro.com/otp?pubkey=${pubkey}`);

      enqueueSnackbar("New code send!", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
    } catch (e) {
      enqueueSnackbar("No send code", {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          horizontal: "left",
          vertical: "bottom",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledTitlePage variant="h3">Enter your code</StyledTitlePage>
      <StyledDescriptionPage variant="body3">
        Please enter the 6-digit code we sent you as a direct message.
      </StyledDescriptionPage>

      <StyledVideo>
        <video playsInline width="300" autoPlay loop muted>
          <source src={"/video/2.mp4"} type="video/mp4" />
        </video>
      </StyledVideo>

      <OTPInput name="code" length={OTP_LENGTH} onChange={handleChangeOtp} />

      <Button
        fullWidth
        disabled={isLoading ? false : values.code.length !== OTP_LENGTH}
        size="large"
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
          variant="text"
          startIcon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleResetCode}
          size="small"
          variant="text"
        >
          Resend the code
        </Button>
      </StyledActions>
    </>
  );
};
