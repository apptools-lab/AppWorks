import I18nService from '@iceworks/i18n';
import * as vscode from 'vscode';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';

const i18n = new I18nService();

// set I18n
i18n.registry('zh-cn',zhCNTextMap);
i18n.registry('en',enUSTextMap);
i18n.setLocal(vscode.env.language);

export default i18n;