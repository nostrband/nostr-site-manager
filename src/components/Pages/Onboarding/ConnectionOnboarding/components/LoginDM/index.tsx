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
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ArrowRightIcon, ChevronLeftIcon, KeyIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { validationSchemaLoginDM } from "@/validations/rules";
import * as yup from "yup";
import { nip19 } from "nostr-tools";
import axios from "axios";
import { addOnAuth } from "@/services/nostr/nostr";

interface LoginDMValues {
  npub: string;
}

const initialValues: LoginDMValues = {
  npub: "",
};

export const LoginDM = ({
  showEnterCode,
}: {
  showEnterCode: (pubkey: string) => void;
}) => {
  const [isLoading, setLoading] = useState(false);
  const isDesktop = useResponsive("up", "sm");
  const sizeField = isDesktop ? "medium" : "small";

  const router = useRouter();

  const { values, errors, touched, submitForm, handleChange, handleBlur } =
    useFormik({
      initialValues,
      validationSchema: validationSchemaLoginDM,
      onSubmit: async (values: LoginDMValues) => {
        setLoading(true);
        const { npub } = values;

        let pubkey = "";
        try {
          if (yup.string().email().isValidSync(npub)) {
            const [name, domain] = npub.split("@");

            if (!name || !domain) {
              throw new Error("Invalid email format");
            }

            const res = await axios.get(
              `https://${domain}/.well-known/nostr.json?name=${name}`,
            );
            pubkey = res.data.names[name];
          } else {
            const decoded = nip19.decode(npub);
            if (decoded.type !== "npub") throw new Error("Invalid npub");
            pubkey = decoded.data as string;
          }

          await axios.get(`https://api.npubpro.com/otp?pubkey=${pubkey}`);

          showEnterCode(pubkey);
        } catch (e) {
          enqueueSnackbar("Error bad name", {
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

  const handleAdvanced = async () => {
    document.dispatchEvent(
      new CustomEvent("nlLaunch", { detail: "welcome-login" }),
    );
    await new Promise<void>((ok) => {
      addOnAuth(async (type: string) => {
        if (type !== "logout") ok();
      });
    });
    router.push("/onboarding/create-site");
  };

  const isError = touched.npub && Boolean(errors.npub);

  return (
    <>
      <StyledTitlePage variant="h3">Log in</StyledTitlePage>
      <StyledDescriptionPage variant="body3">
        Enter your user name or npub. You will receive a direct message with a
        code.
      </StyledDescriptionPage>

      <StyledVideo>
        <video playsInline width="300" autoPlay loop muted>
          <source src={"/video/1.mp4"} type="video/mp4" />
        </video>
      </StyledVideo>

      <FormControl error={isError} fullWidth size={sizeField}>
        <InputLabel htmlFor="npub">npub... or name@domain.com</InputLabel>
        <OutlinedInput
          id="npub"
          name="npub"
          label="npub... or name@domain.com"
          onChange={handleChange}
          value={values.npub}
          onBlur={handleBlur}
          error={isError}
        />
        {touched.npub && errors.npub && (
          <FormHelperText id="component-error-text">
            {errors.npub}
          </FormHelperText>
        )}
      </FormControl>

      <Button
        fullWidth
        disabled={isLoading ? false : !values.npub.length}
        size="large"
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
          variant="text"
          startIcon={<ChevronLeftIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="small"
          variant="text"
          startIcon={<KeyIcon />}
          onClick={handleAdvanced}
        >
          Advanced
        </Button>
      </StyledActions>
    </>
  );
};
