import i18n from '@iceworks/i18n';
import * as zhCNTextMap from '../locales/zh-CN.json';
import * as enUSTextMap from '../locales/en-US.json';
import * as vscode from 'vscode';

i18n.registry("zh-CN",zhCNTextMap);
i18n.registry("en",enUSTextMap);
i18n.setLocal(vscode.env.language);

export const createApplicationLabel = i18n.format("extension.iceworksApp.showExtensionsQuickPick.createApplication.label");
export const createApplicationDetail = i18n.format("extension.iceworksApp.showExtensionsQuickPick.createApplication.detail")