/* eslint-disable import/first */
(window as any).isVscode = typeof acquireVsCodeApi === 'function';

import { createApp, IAppConfig } from 'ice';
import { get as getConfig } from '@/services/config';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async () => {
      const config = await getConfig();
      return { config };
    }
  },
  store: {
    getInitialStates: (initialData) => {
      const { config } = initialData;
      const { materialCollections } = config;
      return {
        materials: {
          collections: materialCollections
        }
      };
    }
  }
};

createApp(appConfig);
