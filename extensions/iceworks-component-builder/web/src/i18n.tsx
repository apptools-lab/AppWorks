import {createIntl,RawIntlProvider, IntlShape} from 'react-intl'; 
import React, { useEffect, useState } from 'react'
import { ConfigProvider, Loading, Notification } from '@alifd/next';

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
export const defaultIntl = createIntl({locale:'default',messages:localeMessages['zh-cn'].messages})
const changeLanguage = (newLang: string) =>{
  return createIntl({locale:localeMessages[newLang].reactLocale,messages:localeMessages[newLang].messages});
}
export const LocaleProvider = (props)=>{
  const [i18n,setI18n] = useState(defaultIntl);
  const [loading,setLoading] = useState(false)
  useEffect(()=>{
    async function initI18n(){
      try{
        setLoading(true);
        const lang = await callService('common','getLanguage');
        setI18n(changeLanguage(lang));
      }catch(e){
        Notification.error({ content: e.message });
      }
      finally{
        setLoading(false);
      }
    }
    initI18n();
    
  },[]);

  // const i18n = createIntl({locale:lang,messages:localeMessages[lang].messages}); 
  return (
    <RawIntlProvider value={i18n}>
      <ConfigProvider>
        {loading?<Loading visible={loading} style={{width: '100%', height:'80vh'}} /> :React.Children.only(props.children)}
      </ConfigProvider>
    </RawIntlProvider>
  )
}

export function checkI18nReady(intl: IntlShape){
  return intl.locale !== 'default'
}