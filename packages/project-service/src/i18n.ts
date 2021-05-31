import * as vscode from 'vscode';
import I18nService from '@appworks/i18n';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';

// 注册语言表
const i18n = new I18nService();

i18n.registry('zh-cn', zhCNTextMap);
i18n.registry('en', enUSTextMap);

// 设置使用的语言
i18n.setLocal(vscode.env.language);

export default i18n;
