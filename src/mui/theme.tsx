"use client";
import { createTheme } from "@mui/material/styles";
import { grey, red } from "@mui/material/colors";
import localFont from "next/font/local";
import shadows from "@mui/material/styles/shadows";

declare module "@mui/material/styles" {
  interface Palette {
    customBackground: Palette["primary"];
    appBar: Palette["primary"];
    decorate: Palette["primary"];
    textColor: Palette["primary"];
    textColorDanger: Palette["primary"];
    buttonSidebarBackground: Palette["primary"];
    buttonSidebarActive: Palette["primary"];
    lightInfo: Palette["primary"];
    darkInfo: Palette["primary"];
  }

  interface PaletteOptions {
    customBackground?: PaletteOptions["primary"];
    appBar?: Palette["primary"];
    decorate?: Palette["primary"];
    textColor?: Palette["primary"];
    textColorDanger?: Palette["primary"];
    buttonSidebarBackground?: Palette["primary"];
    buttonSidebarActive?: Palette["primary"];
    lightInfo?: Palette["primary"];
    darkInfo?: Palette["primary"];
  }
}

declare module "@mui/material/AppBar" {
  interface AppBarPropsColorOverrides {
    appBar: true;
  }
}

declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    decorate: true;
    lightInfo: true;
    primary: true;
  }
}

declare module "@mui/material/Rating" {
  interface RatingPropsColorOverrides {
    decorate: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    textColor: true;
    buttonSidebarBackground: true;
    buttonSidebarActive: true;
    decorate: true;
    lightInfo: true;
    darkInfo: true;
    primary: true;
  }
}

declare module "@mui/material/Checkbox" {
  interface CheckboxPropsColorOverrides {
    textColor: true;
    buttonSidebarBackground: true;
    buttonSidebarActive: true;
    decorate: true;
    lightInfo: true;
    darkInfo: true;
    primary: true;
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    textColorDanger: true;
    primary: true;
    decorate: true;
  }
}

declare module "@mui/material/Fab" {
  interface FabPropsColorOverrides {
    decorate: true;
    primary: true;
    lightInfo: true;
  }
}

export const InterDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/InterDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  display: "swap",
});

const InterVariable = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#292C34",
    },
    secondary: {
      main: "#696F7D",
    },
    info: {
      light: "#0000EE",
      main: "#0000EE",
      dark: "#0000EE",
      contrastText: "#0000EE",
    },
    error: {
      main: red.A400,
    },
    customBackground: {
      light: grey[100],
      main: "#F5F5F5",
    },
    buttonSidebarBackground: {
      light: "#292C34",
      main: "#f8f8f8",
      dark: "#f4f0f0",
      contrastText: "#292C34",
    },
    buttonSidebarActive: {
      light: "#292C34",
      main: "#f8f8f8",
      dark: "#f4f0f0",
      contrastText: "#292C34",
    },
    appBar: {
      light: "#fff",
      main: "#fff",
      dark: "#292C34",
      contrastText: "#292C34",
    },
    textColor: {
      light: "#fff",
      main: "#292C34",
      dark: "#2f313a",
      contrastText: "#fff",
    },
    textColorDanger: {
      light: "#f5bdbd",
      main: "#292C34",
      dark: "#302a2a",
      contrastText: "#b34040",
    },
    decorate: {
      light: "#fff",
      main: "#FF3ED9",
      dark: "#c62fa9",
      contrastText: "#fff",
    },
    lightInfo: {
      light: "#fff",
      main: "rgba(105, 111, 125, 0.08)",
      dark: "#A5A1A4",
      contrastText: "#292C34",
    },
    darkInfo: {
      light: "#fff",
      main: "#988F97",
      dark: "#7c747b",
      contrastText: "#fff",
    },
  },
  shadows: [
    "none",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.06)",
  ] as typeof shadows,
  typography: {
    fontFamily: InterVariable.style.fontFamily,
    allVariants: {
      color: "#000",
    },
    body1: {
      color: "#000",
    },
    body2: {
      color: "rgba(0, 0, 0, 0.6)",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#fff",
          color: "#000",
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          body1: "div",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "600",
          textTransform: "none",
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "inherit",
          "& .Mui-disabled": {
            color: "rgba(0, 0, 0, 0.38) !important",
            WebkitTextFillColor: "rgba(0, 0, 0, 0.38) !important",
          },

          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(0, 0, 0, 0.23)",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FF3ED9",
          },

          "&.MuiInputBase-sizeSmall:not(.MuiInputBase-multiline)": {
            height: "42px",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "inherit",
          "&.Mui-focused": {
            color: "#FF3ED9",
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#FF3ED9",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          "&:active": {
            boxShadow: "none",
          },
          "&:focus": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          background: grey[400],
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        maxWidthLg: {
          maxWidth: "1344px",
          "@media (min-width: 600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
          },

          "@media (min-width: 1200px)": {
            maxWidth: "1092px",
            paddingLeft: "0",
            paddingRight: "0",
          },
        },
        maxWidthMd: {
          maxWidth: "1240px",
          "@media (min-width: 900px)": {
            maxWidth: "940px",
          },
        },
      },
    },
  },
});

export default theme;
