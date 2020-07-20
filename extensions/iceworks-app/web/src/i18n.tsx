import {createIntl,IntlProvider} from 'react-intl'; 
import React from 'react'
import { ConfigProvider } from '@alifd/next';

// 引入 locale 配置文件
import enUSLocale from './locales/en-US.json';
import zhCNLocale from './locales/zh-CN.json';
import callService from './callService';


let lang = 'zh-cn';

// 创建语言包
export const localeMessages = {
  'en':enUSLocale,
  'zh-cn':zhCNLocale
}

callService('common','getLanguage').then(res=>{
  lang = res
});

export const i18n = createIntl({locale:lang,messages:localeMessages[lang]}); 

// 找到当前语言即使用的包


export default i18n;

export const LocaleProvider = (props)=>{

  return (
    <IntlProvider locale={lang} messages={localeMessages[lang]}>
      <ConfigProvider>
        {React.Children.only(props.children)}
      </ConfigProvider>
    </IntlProvider>
  )
}