import _i18n from '@iceworks/i18n';
import * as vscode from 'vscode';
import * as zhCNTextMap from './locales/zh-CN.json';
import * as enUSTextMap from './locales/en-US.json';


export const i18n = _i18n;

// set I18n
i18n.registry('zh-cn',zhCNTextMap);
i18n.registry('en',enUSTextMap);
i18n.setLocal(vscode.env.language);