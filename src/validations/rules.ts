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

const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)*[a-zA-Z]{2,}$/;

export const validationSchemaDomain = yup.object().shape({
  domain: yup
    .string()
    .matches(domainRegex, "Invalid domain name")
    .required("Domain name is required"),
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
