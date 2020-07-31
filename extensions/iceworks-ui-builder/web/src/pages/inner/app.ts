import { createApp } from 'ice';
import Inner from './index';

const appConfig = {
  router: {
    routes: [{ path: '/', component: Inner }],
  },
  app: {
    rootId: 'root',
  },
};

createApp(appConfig);
