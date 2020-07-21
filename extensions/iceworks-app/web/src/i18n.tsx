import { createIntl, RawIntlProvider } from 'react-intl'; 
import React, { useEffect, useState } from 'react'
import { ConfigProvider } from '@alifd/next';

// 引入 locale 配置文件
import enUSLocale from './locales/en-US.json';
import zhCNLocale from './locales/zh-CN.json';
import callService from './callService';

// 创建语言包
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

// 找到当前语言即使用的包
export const defaultIntl = createIntl({locale:'zh-CN', messages:localeMessages['zh-cn'].messages})
const changeLanguage = (newLang: string) =>{
  return createIntl({locale:localeMessages[newLang].reactLocale, messages:localeMessages[newLang].messages});
}
export const LocaleProvider = ({children})=>{
  const [i18n,setI18n] = useState(defaultIntl);
  useEffect(()=>{
    async function initI18n(){
      const lang = await callService('common', 'getLanguage');
      setI18n(changeLanguage(lang));
    }
    initI18n();
  },[]);

  return (
    <RawIntlProvider value={i18n}>
      <ConfigProvider>
        {React.Children.only(children)}
      </ConfigProvider>
    </RawIntlProvider>
  )
}