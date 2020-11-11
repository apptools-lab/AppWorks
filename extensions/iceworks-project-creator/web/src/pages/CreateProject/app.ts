import { createApp } from 'ice';
import Home from './index';

window.__changeTheme__('@alifd/theme-iceworks-dark');

const appConfig = {
  router: {
    routes: [{ path: '/', component: Home }],
  },
  app: {
    rootId: 'ice-container',
  },
};

createApp(appConfig);
