import { FormikHandlers } from "formik";

export interface IBaseSetting {
  handleChange?: FormikHandlers["handleChange"];
  handleBlur?: FormikHandlers["handleBlur"];
  submitForm: () => Promise<void>;
  isLoading: boolean;
}

export type InputNavigation = {
  id: string;
  type: "primary" | "secondary";
  field: "title" | "link";
  value: string;
};

export type InputNavigationReset = {
  id: string;
  type: "primary" | "secondary";
  fields: { title: string; link: string };
};
