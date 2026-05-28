import { Platform } from 'react-native';

// import type { Theme } from '../types';

const WEB_FONT_STACK =
  '"Outfit",system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const fonts = Platform.select({
  web: {
    regular: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '400',
    },
    medium: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '500',
    },
    bold: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '600',
    },
    heavy: {
      fontFamily: WEB_FONT_STACK,
      fontWeight: '700',
    },
  },
  ios: {
    regular: {
      fontFamily: 'Outfit',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Outfit',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'Outfit',
      fontWeight: '600',
    },
    heavy: {
      fontFamily: 'Outfit',
      fontWeight: '700',
    },
  },
  default: {
    regular: {
      fontFamily: 'Outfit',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Outfit',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Outfit',
      fontWeight: '600',
    },
    heavy: {
      fontFamily: 'Outfit',
      fontWeight: '700',
    },
  },
});
