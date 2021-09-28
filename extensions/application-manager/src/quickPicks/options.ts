import * as vscode from 'vscode';
import { checkIsPegasusProject, checkIsTargetProjectType } from '@appworks/project-service';
import { checkIsAliInternal, checkIsInstalledDoctor } from '@appworks/common-service';
import i18n from '../i18n';

/**
 * 该数组总是列出所有可用的命令，外部可以基于该数组进行赛选
 */
export default [
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.projectCreator.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.projectCreator.detail'),
    command: 'project-creator.create-project.start',
    async condition() {
      return vscode.extensions.getExtension('iceworks-team.iceworks-project-creator');
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.customScaffold.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.customScaffold.detail'),
    command: 'project-creator.custom-scaffold.start',
    async condition() {
      return vscode.extensions.getExtension('iceworks-team.iceworks-project-creator');
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.dashboard.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.dashboard.detail'),
    command: 'applicationManager.dashboard.start',
    async condition() {
      const isTargetProjectType = await checkIsTargetProjectType();
      return isTargetProjectType;
    },
  },
  // {
  //   label: i18n.format('extension.applicationManager.showEntriesQuickPick.welcomePage.label'),
  //   detail: i18n.format('extension.applicationManager.showEntriesQuickPick.welcomePage.detail'),
  //   command: 'applicationManager.welcome.start',
  // },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.openSettings.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.openSettings.detail'),
    command: 'applicationManager.configHelper.start',
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.doctor.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.doctor.detail'),
    command: 'doctor.dashboard',
    async condition() {
      return checkIsInstalledDoctor();
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.runDebug.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.runDebug.detail'),
    command: 'applicationManager.scripts.runDebug',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.DefPublish.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.DefPublish.detail'),
    command: 'applicationManager.scripts.DefPublish',
    async condition() {
      return (await checkIsAliInternal()) && (await checkIsTargetProjectType());
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.imgcook.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.imgcook.detail'),
    command: 'imgcook.showPanel',
    args: { fromIceworks: true },
    async condition() {
      return vscode.extensions.getExtension('imgcook.imgcook');
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.generatePage.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.generatePage.detail'),
    command: 'material-helper.page-generator.start',
    async condition() {
      return (
        (await checkIsTargetProjectType()) &&
        !(await checkIsPegasusProject()) &&
        vscode.extensions.getExtension('iceworks-team.iceworks-material-helper')
      );
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.materialImport.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.materialImport.detail'),
    command: 'material-helper.material-importer.start',
    async condition() {
      return (
        (await checkIsTargetProjectType()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper')
      );
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.createComponent.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.createComponent.detail'),
    command: 'material-helper.component-creator.start',
    async condition() {
      return (
        (await checkIsTargetProjectType()) &&
        !(await checkIsPegasusProject()) &&
        vscode.extensions.getExtension('iceworks-team.iceworks-material-helper')
      );
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.showMaterialDocs.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.showMaterialDocs.detail'),
    command: 'material-helper.showMaterialDocs',
    async condition() {
      return (
        (await checkIsTargetProjectType()) && vscode.extensions.getExtension('iceworks-team.iceworks-material-helper')
      );
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.reinstall.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.reinstall.detail'),
    command: 'applicationManager.nodeDependencies.reinstall',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.addDepsAndDevDeps.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.addDepsAndDevDeps.detail'),
    command: 'applicationManager.nodeDependencies.addDepsAndDevDeps',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
  {
    label: i18n.format('extension.applicationManager.showEntriesQuickPick.runBuild.label'),
    detail: i18n.format('extension.applicationManager.showEntriesQuickPick.runBuild.detail'),
    command: 'applicationManager.scripts.runBuild',
    async condition() {
      return await checkIsTargetProjectType();
    },
  },
];
