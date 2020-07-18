import * as vscode from 'vscode';
import _i18n from '@iceworks/i18n';
import * as zhCNTextMap from '../locales/zh-CN.json';
import * as enUSTextMap from '../locales/en-US.json';

export const i18n = _i18n;

_i18n.registry('zh-CN',zhCNTextMap);
_i18n.registry('en',enUSTextMap);
_i18n.setLocal(vscode.env.language);
