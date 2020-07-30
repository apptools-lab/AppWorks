import { createIntl, RawIntlProvider } from 'react-intl';
import React, { useEffect, useState } from 'react';
import { ConfigProvider, Loading } from '@alifd/next';
import enUSNextMessages from '@alifd/next/lib/locale/en-us';
import zhCNNextMessages from '@alifd/next/lib/locale/zh-cn';

import callService from './callService';
import enUSMessages from './locales/en-US.json';
import zhCNMessages from './locales/zh-CN.json';

const DEFAULT_LOCALE = 'zh-cn';

export const localeMessages = {
  en: {
    messages: enUSMessages,
    nextMessages: enUSNextMessages,
  },
  'zh-cn': {
    messages: zhCNMessages,
    nextMessages: zhCNNextMessages,
  },
};

const getIntl = (locale: string) => {
  let localeMessage = localeMessages[locale];
  if (!localeMessage) {
    locale = DEFAULT_LOCALE;
    localeMessage = localeMessages[locale];
  }
  return createIntl({ locale, messages: localeMessage.messages });
};
export const LocaleProvider = (props) => {
  const [i18n, setI18n] = useState(() => getIntl(DEFAULT_LOCALE));
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function initI18n() {
      try {
        const lang = await callService('common', 'getLanguage');
        setI18n(getIntl(lang));
      } catch (e) {
        // ignore i18n error, just using default language
      } finally {
        setLoading(false);
      }
    }
    initI18n();
  }, []);

  return (
    <RawIntlProvider value={i18n}>
      <ConfigProvider locale={localeMessages[i18n.locale].nextMessages}>
        {loading ? (
          <Loading visible={loading} style={{ width: '100%', height: '80vh' }} />
        ) : (
          React.Children.only(props.children)
        )}
      </ConfigProvider>
    </RawIntlProvider>
  );
};
