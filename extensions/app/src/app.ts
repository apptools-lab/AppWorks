import { createApp, IAppConfig } from 'ice';
import { callService } from '@/services';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async () => {
      const config = await callService('config', 'get');
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
