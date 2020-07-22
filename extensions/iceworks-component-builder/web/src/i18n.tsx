import { createIntl, RawIntlProvider } from 'react-intl'; 
import React, { useEffect, useState } from 'react'
import { ConfigProvider, Loading } from '@alifd/next';

// 引入 locale 配置文件
import enUSLocale from './locales/en-US.json';
import zhCNLocale from './locales/zh-CN.json';
import callService from './callService';

const DEFAULT_LANG = 'zh-cn';

export const localeMessages = {
  'en': {
    messages:enUSLocale,
    nextLocale:'zhCN',
    reactLocale:'zh-CN'
  },
  'zh-cn':{
    messages:zhCNLocale,
    nextLocal:'enUS',
    reactLocale:'en'
  }
}

const getIntl = (lang: string) =>{
  let localeMessage = localeMessages[lang];
  if (!localeMessage) {
    localeMessage = localeMessages[DEFAULT_LANG];
  }
  return createIntl({locale: localeMessage.reactLocale, messages: localeMessage.messages});
}
export const LocaleProvider = (props)=>{
  const [i18n, setI18n] = useState(() => getIntl(DEFAULT_LANG));
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    async function initI18n(){
      try {
        const lang = await callService('common', 'getLanguage');
        setI18n(getIntl(lang));
      } catch(e) {
        // ignore i18n error, just using default language
      } finally {
        setLoading(false);
      }
    }
    initI18n();
  },[]);

  return (
    <RawIntlProvider value={i18n}>
      <ConfigProvider>
        {loading ? <Loading visible={loading} style={{width: '100%', height:'80vh'}} /> : React.Children.only(props.children)}
      </ConfigProvider>
    </RawIntlProvider>
  )
}