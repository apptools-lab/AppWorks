import { createApp } from 'ice';
import Canvas from './index';

alert(123)
const appConfig = {
  router: {
    routes: [{ path: '/', component: Canvas }],
  },
  app: {
    rootId: 'root',
  },
};

createApp(appConfig);
