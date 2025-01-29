import { useFormik } from "formik";
import { StyledDescriptionPage, StyledTitlePage } from "../../../styled";
import { enqueueSnackbar } from "notistack";
import useResponsive from "@/hooks/useResponsive";
import { useState } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ChevronLeftIcon, UserAddIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";

const initialValues: { username: string } = {
  username: "",
};

export const SignUp = () => {
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

        enqueueSnackbar("Internal service error", {
          autoHideDuration: 3000,
          variant: "error",
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
      <StyledTitlePage>Create Nostr profile</StyledTitlePage>
      <StyledDescriptionPage variant="body2">
        Choose any username, you can always change it later.
      </StyledDescriptionPage>

      <FormControl fullWidth size={sizeField}>
        <InputLabel htmlFor="username">Enter username</InputLabel>
        <OutlinedInput
          id="username"
          name="username"
          label="Enter username"
          onChange={handleChange}
          value={values.username}
          onBlur={handleBlur}
        />
      </FormControl>

      <Button
        fullWidth
        disabled={isLoading ? false : !values.username.length}
        size="large"
        color="decorate"
        variant="contained"
        endIcon={<UserAddIcon />}
        startIcon={startIconCreate}
        onClick={handleCreate}
      >
        Create profile
      </Button>

      <Button
        size="small"
        color="decorate"
        variant="text"
        startIcon={<ChevronLeftIcon />}
        onClick={handleBack}
      >
        Back
      </Button>
    </>
  );
};
