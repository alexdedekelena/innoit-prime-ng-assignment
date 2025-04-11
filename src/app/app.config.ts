import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

// TODO: check proper place for these theming overrides
const customPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#f7f8ff',
      100: '#d7dbfd',
      200: '#b7bffb',
      300: '#97a3f9',
      400: '#7886f7',
      500: '#586af5',
      600: '#4b5ad0',
      700: '#3e4aac',
      800: '#303a87',
      900: '#232a62',
      950: '#161b3d',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: customPreset,
      },
    }),
  ],
};
