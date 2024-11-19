import type { Preview } from "@storybook/react";
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";

import theme from "../src/mui/theme";

const kindleViewports = {
  kindleFire3: {
    name: "320",
    styles: {
      width: "320px",
      height: "400px",
    },
  },
  kindleFire2: {
    name: "768",
    styles: {
      width: "768px",
      height: "600px",
    },
  },
  kindleFireHD: {
    name: "1280",
    styles: {
      width: "1280px",
      height: "100%",
    },
  },
};

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      value: "#ececec",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        ...MINIMAL_VIEWPORTS,
        ...kindleViewports,
      },
    },
  },

  decorators: [
    withThemeFromJSXProvider({
      GlobalStyles: CssBaseline,
      Provider: ThemeProvider,
      themes: {
        light: theme,
        // dark: darkTheme,
      },
      defaultTheme: "light",
    }),
  ],
};

export default preview;
