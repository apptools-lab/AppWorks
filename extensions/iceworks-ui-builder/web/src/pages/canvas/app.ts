import { createApp } from 'ice';
import Canvas from './index';

const appConfig = {
  router: {
    routes: [{ path: '/', component: Canvas }],
  },
  app: {
    rootId: 'root',
  },
};

createApp(appConfig);
