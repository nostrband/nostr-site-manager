import * as yup from "yup";

export const validationSchemaLogin = yup.object({
  email: yup.string().required("Enter email"),
  username: yup.string().required("Enter your name"),
});

export const validationSchemaConfirmDelete = yup.object({
  confirmText: yup
    .string()
    .required("Enter confirm text")
    .oneOf(["delete"], 'The value should be "delete"'),
});

export const validationSchemaDomain = yup.object({
  domain: yup.string().required("Enter domain"),
});

export const validationSchemaMakePrivateSite = yup.object().shape({
  isPrivate: yup.boolean().notRequired(),
  password: yup
    .string()
    .test(
      "passwords-match",
      "Password is required when private",
      function (value) {
        return !(this.parent.isPrivate === true && value === undefined);
      },
    ),
});
