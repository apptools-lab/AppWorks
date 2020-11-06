import { createApp } from 'ice';
import Home from './index';

const appConfig = {
  router: {
    routes: [{ path: '/', component: Home }],
  },
  app: {
    rootId: 'ice-container',
  },
};

createApp(appConfig);
