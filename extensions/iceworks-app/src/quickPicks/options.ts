import * as vscode from 'vscode';
import { getProjectType, checkIsPegasusProject, checkIsTargetProjectType } from '@iceworks/project-service';
import { checkIsAliInternal, checkIsInstalledDoctor } from '@iceworks/common-service';
import i18n from '../i18n';

/**
 * 该数组总是列出所有可用的命令，外部可以基于该数组进行赛选
 */
export default [
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.projectCreator.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.projectCreator.detail'),
    command: 'iceworks-project-creator.create-project.start',
    async condition() {
      return vscode.extensions.getExtension('iceworks-team.iceworks-project-creator');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.customScaffold.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.customScaffold.detail'),
    command: 'iceworks-project-creator.custom-scaffold.start',
    async condition() {
      return vscode.extensions.getExtension('iceworks-team.iceworks-project-creator');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.dashboard.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.dashboard.detail'),
    command: 'iceworksApp.dashboard.start',
    async condition() {
      const isTargetProjectType = await checkIsTargetProjectType();
      return isTargetProjectType;
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.welcomePage.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.welcomePage.detail'),
    command: 'iceworksApp.welcome.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.openSettings.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.openSettings.detail'),
    command: 'iceworksApp.configHelper.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.doctor.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.doctor.detail'),
    command: 'iceworks-doctor.dashboard',
    async condition() {
      const isInstalledDoctor = checkIsInstalledDoctor();
      const isTargetProjectType = await checkIsTargetProjectType();
      return isInstalledDoctor && isTargetProjectType;
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.runDebug.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.runDebug.detail'),
    command: 'iceworksApp.scripts.runDebug',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.DefPublish.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.DefPublish.detail'),
    command: 'iceworksApp.scripts.DefPublish',
    async condition() {
      return (await checkIsAliInternal()) && await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.generatePage.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.generatePage.detail'),
    command: 'iceworks-material-helper.page-generator.start',
    async condition() {
      return (await checkIsTargetProjectType()) && !(await checkIsPegasusProject()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.createPage.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.createPage.detail'),
    command: 'iceworks-material-helper.page-creator.start',
    async condition() {
      return (await checkIsTargetProjectType()) && !(await checkIsPegasusProject()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.materialImport.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.materialImport.detail'),
    command: 'iceworks-material-helper.material-importer.start',
    async condition() {
      return (await checkIsTargetProjectType()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.design-component',
    async condition() {
      const projectType = await getProjectType();
      return projectType === 'react' && vscode.extensions.getExtension('iceworks-team.iceworks-ui-builder');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.detail'),
    command: 'iceworks-material-helper.component-creator.start',
    async condition() {
      return (await checkIsTargetProjectType()) && !(await checkIsPegasusProject()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.showMaterialDocs.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.showMaterialDocs.detail'),
    command: 'iceworks-material-helper.showMaterialDocs',
    async condition() {
      return (await checkIsTargetProjectType()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper');
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.reinstall.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.reinstall.detail'),
    command: 'iceworksApp.nodeDependencies.reinstall',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.addDepsAndDevDeps.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.addDepsAndDevDeps.detail'),
    command: 'iceworksApp.nodeDependencies.addDepsAndDevDeps',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.runBuild.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.runBuild.detail'),
    command: 'iceworksApp.scripts.runBuild',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
];
