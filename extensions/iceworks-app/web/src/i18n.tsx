import {createIntl,IntlProvider} from 'react-intl'; 
import React from 'react'
// 引入 locale 配置文件
import enUSLocale from './locales/en-US.json';
import zhCNLocale from './locales/zh-CN.json';

// 找到当前语言即使用的包
const lang = 'en';
function getIntlMessage(lang: string){
  switch(lang){
    case 'en': return enUSLocale as Record<string,string>;
    case 'zh-cn':return zhCNLocale as Record<string,string>;
    default:return zhCNLocale as Record<string,string>;
  }
}

export const i18n = createIntl({locale:lang,messages:getIntlMessage(lang)});

export const LocaleProvider = (props)=>{
    
  return (
    <IntlProvider locale={lang} messages={getIntlMessage(lang)}>
      {React.Children.only(props.children)}
    </IntlProvider>
  )
}