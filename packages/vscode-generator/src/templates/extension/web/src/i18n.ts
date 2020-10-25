import I18nService from '@iceworks/i18n';
import zhCNTextMap from './locales/zh-CN.json';
import enUSTextMap from './locales/en-US.json';

// 注册语言表
const i18n = new I18nService();
i18n.registry('zh-cn', zhCNTextMap);
i18n.registry('en', enUSTextMap);

export default i18n;
