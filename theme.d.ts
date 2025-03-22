import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    body5: React.CSSProperties;
    h7: React.CSSProperties;
    subtitle4?: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    body5?: React.CSSProperties;
    h7?: React.CSSProperties;
    subtitle4?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
    body4: true;
    body5: true;
    h7: true;
    subtitle4: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsColorOverrides {
    primary: true;
  }
}
