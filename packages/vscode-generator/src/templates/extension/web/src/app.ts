import { createApp } from 'ice';
import callService from '@/callService';

declare global {
  // eslint-disable-next-line
  interface Window {
    USE_EN: any;
  }
}

const appConfig = {
  app: {
    rootId: 'ice-container',
  },
};

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
  createApp(appConfig);
});
