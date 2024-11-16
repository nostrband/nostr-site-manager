import type { Preview } from "@storybook/react";

import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import theme from '../src/mui/theme';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      value: '#ececec'
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [withThemeFromJSXProvider({
    GlobalStyles: CssBaseline,
    Provider: ThemeProvider,
    themes: {
      light: theme,
      // dark: darkTheme,
    },
    defaultTheme: 'light',
  })]
};

export default preview;
