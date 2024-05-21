"use client";
import { Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    customBackground: Palette["primary"];
    appBar: Palette["primary"];
    decorate: Palette["primary"];
    textColor: Palette["primary"];
    textColorDanger: Palette["primary"];
    buttonSidebarBackground: Palette["primary"];
    buttonSidebarActive: Palette["primary"];
  }

  interface PaletteOptions {
    customBackground?: PaletteOptions["primary"];
    appBar?: Palette["primary"];
    decorate?: Palette["primary"];
    textColor?: Palette["primary"];
    textColorDanger?: Palette["primary"];
    buttonSidebarBackground?: Palette["primary"];
    buttonSidebarActive?: Palette["primary"];
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
  }
}

declare module "@mui/material/IconButton" {
  interface IconButtonPropsColorOverrides {
    textColorDanger: true;
  }
}

export const font = Inter({
  //   weight: ['300', '400', '500', '700'],
  subsets: ["cyrillic"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A1C1E",
    },
    secondary: {
      main: "#424754",
    },
    // info: {
    //   light: blue[500],
    //   main: blue[900],
    //   dark: blue[900],
    //   contrastText: blue[900]
    // },
    error: {
      main: red.A400,
    },
    customBackground: {
      light: "#e9e9e9",
      main: "#F5F5F5",
    },
    buttonSidebarBackground: {
      light: "#2f313a",
      main: "#f8f8f8",
      dark: "#f4f0f0",
      contrastText: "#2f313a",
    },
    buttonSidebarActive: {
      light: "#2f313a",
      main: "#f8f8f8",
      dark: "#f4f0f0",
      contrastText: "#2f313a",
    },
    appBar: {
      light: "#fff",
      main: "#fff",
      dark: "#000",
      contrastText: "#000",
    },
    textColor: {
      light: "#fff",
      main: "#1A1C1E",
      dark: "#2f313a",
      contrastText: "#fff",
    },
    textColorDanger: {
      light: "#f5bdbd",
      main: "#1A1C1E",
      dark: "#302a2a",
      contrastText: "#b34040",
    },
    decorate: {
      light: "#fff",
      main: "#E0F54A",
      dark: "#000",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: font.style.fontFamily,
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
        },
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
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});

export default theme;
