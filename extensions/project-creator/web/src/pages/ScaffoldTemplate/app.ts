import { createApp } from 'ice';
import Dashboard from './pages/Dashboard';
import BasicLayout from './layouts/BasicLayout';

window.__changeTheme__('@alifd/theme-design-pro');

const appConfig = {
  router: {
    routes: [
      {
        path: '/',
        component: BasicLayout,
        children: [
          {
            path: '/',
            exact: true,
            component: Dashboard,
          },
        ],
      },
    ],
  },
  app: {
    rootId: 'ice-container',
  },
};

createApp(appConfig);
