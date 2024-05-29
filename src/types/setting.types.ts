import { FormikHandlers } from "formik";

export interface IBaseSetting {
  handleChange?: FormikHandlers["handleChange"];
  handleBlur?: FormikHandlers["handleBlur"];
  submitForm: () => Promise<void>;
  isLoading: boolean;
}
