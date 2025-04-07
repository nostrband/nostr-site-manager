"use client";
import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import localFont from "next/font/local";
import shadows from "@mui/material/styles/shadows";
import { PRIMARY_COLOR } from "@/consts";

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
    mode: "light",
    primary: {
      main: PRIMARY_COLOR,
    },
    secondary: {
      main: "#000",
    },
    warning: {
      main: "#EF6C00",
    },
    error: {
      main: "#FF4B4E",
    },
    success: {
      main: "#2E7D32",
    },
    background: {
      default: grey[100],
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
    h3: {
      fontSize: 30,
      fontWeight: "bold",
      lineHeight: "130%",
    },
    h4: {
      fontSize: 24,
      lineHeight: "130%",
      fontWeight: "bold",
    },
    h5: {
      fontSize: 20,
      lineHeight: "130%",
      fontWeight: "bold",
    },
    h6: {
      fontSize: 16,
      lineHeight: "130%",
      fontWeight: "bold",
    },
    h7: {
      color: "#000",
      fontWeight: "bold",
      fontSize: 14,
      lineHeight: "130%",
      fontFamily: InterVariable.style.fontFamily,
    },
    subtitle2: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 14,
      fontWeight: "500",
      lineHeight: "157%",
    },
    subtitle3: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: "140%",
    },
    subtitle4: {
      color: "#000",
      fontSize: 14,
      fontWeight: "600",
      lineHeight: "130%",
    },
    body1: {
      fontSize: 16,
      lineHeight: "150%",
      fontWeight: "400",
      color: "#000",
    },
    body2: {
      color: "rgba(0, 0, 0, 0.6)",
    },
    body3: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 16,
      fontWeight: "400",
      lineHeight: "160%",
    },
    body4: {
      color: "rgba(0, 0, 0, 0.6)",
      fontSize: 14,
      fontWeight: "400",
      lineHeight: "160%",
    },
    body5: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: "160%",
      color: "rgba(0, 0, 0, 0.6)",
    },
    allVariants: {
      color: "#000",
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

          "&.MuiInputBase-sizeSmall:not(.MuiInputBase-multiline)": {
            height: "42px",
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
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "42px",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: "42px",
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
