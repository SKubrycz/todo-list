import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const preset = definePreset(Aura, {
  semantic: {
    primary: {
      0: '#f0f9ff',
      50: '{sky.50}',
      100: '{sky.100}',
      200: '{sky.200}',
      300: '{sky.300}',
      400: '{sky.400}',
      500: '{sky.500}',
      600: '{sky.600}',
      700: '{sky.700}',
      800: '{sky.800}',
      900: '{sky.900}',
      950: '{sky.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{sky.950}',
          inverseColor: '{sky.50}',
          contrastColor: '{sky.100}',
          hoverColor: '{sky.900}',
          activeColor: '{sky.500}',
        },
        highlight: {
          background: '{sky.950}',
          focusBackground: '{sky.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{sky.100}',
          inverseColor: '{sky.950}',
          contrastColor: 'rgba(18, 18, 18, 1.0)',
          hoverColor: '{sky.200}',
          activeColor: '{sky.300}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});
