import { createApp } from 'ice';
import callService from '@/callService';
import BasicLayout from '@/layouts/index';
import Dashboard from './index';

declare global {
  // eslint-disable-next-line
  interface Window {
    USE_EN: any;
  }
}

// Set global variable language
async function getLanguage() {
  let lang = 'zh-cn';
  try {
    lang = await callService('common', 'getLanguage');
  } catch (e) {
    // ignore
  }
  window.USE_EN = lang !== 'zh-cn';
}

getLanguage().then(() => {
  createApp({
    app: {
      rootId: 'ice-container',
    },
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
  });
});
