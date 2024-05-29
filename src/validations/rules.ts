import * as yup from "yup";

export const validationSchemaLogin = yup.object({
  email: yup.string().required("Enter email"),
  username: yup.string().required("Enter your name"),
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
