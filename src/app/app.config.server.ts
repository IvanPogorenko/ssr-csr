import {
  mergeApplicationConfig,
  ApplicationConfig
} from '@angular/core';

import {
  provideServerRouting
} from '@angular/ssr';

import {
  HTTP_TRANSFER_CACHE_ORIGIN_MAP
} from '@angular/common/http';

import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes),

    {
      provide: HTTP_TRANSFER_CACHE_ORIGIN_MAP,
      useValue: {
        'https://dummyjson.com': 'http://localhost:4200'
      }
    }
  ]
};

export const config = mergeApplicationConfig(
  appConfig,
  serverConfig
);
