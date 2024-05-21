import * as yup from "yup";

export const validationSchemaLogin = yup.object({
  email: yup.string().required("Enter email"),
  username: yup.string().required("Enter your name"),
});
