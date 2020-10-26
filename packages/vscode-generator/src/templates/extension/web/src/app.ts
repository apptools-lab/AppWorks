import { createApp } from 'ice';
import callService from '@/callService';
import i18n from '@/i18n';

const appConfig = {
  app: {
    rootId: 'ice-container',
    getInitialData: async () => {
      const lang = await callService('common', 'getLanguage');
      i18n.setLocal(lang);
      return { lang };
    },
  },
};

createApp(appConfig);
