import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {
  LocationStrategy,
  PathLocationStrategy,
  PlatformLocation,
} from '@angular/common';
import {appRoutes} from './routing/app.routes';
import {NoopLocationStrategy} from './routing/noop-location-strategy';

function isExtensionMode(): boolean {
  const isExt = (globalThis as any).__TD_EXTENSION__ === true || globalThis.location?.protocol === 'chrome-extension:';
  console.info('TD Extension mode:', isExt);
  return isExt;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    {
      provide: LocationStrategy,
      useFactory: (platformLocation: PlatformLocation) =>
        isExtensionMode()
          ? new NoopLocationStrategy()
          : new PathLocationStrategy(platformLocation),
      deps: [PlatformLocation],
    },
  ],
};
