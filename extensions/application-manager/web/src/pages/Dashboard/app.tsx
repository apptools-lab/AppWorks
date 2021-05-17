import React from 'react';
import { createApp } from 'ice';
import Home from './index';
import store from './store';

const { Provider } = store;

const appConfig = {
  router: {
    routes: [{ path: '/', component: Home }],
  },

  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => {
      return <Provider>{children}</Provider>;
    },
  },
};

createApp(appConfig);
