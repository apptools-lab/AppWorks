import * as vscode from 'vscode';
import { getProjectType, checkIsPegasusProject, checkIsNotTarget } from '@iceworks/project-service';
import { checkIsAliInternal, checkIsO2 } from '@iceworks/common-service';
import i18n from '../i18n';

const entries = [
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.projectCreator.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.projectCreator.detail'),
    command: 'iceworks-project-creator.create-project.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.customScaffold.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.customScaffold.detail'),
    command: 'iceworks-project-creator.custom-scaffold.start',
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.openDashboard.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.openDashboard.detail'),
    command: 'iceworks-doctor.dashboard',
    async condition() {
      const doctorExtension = vscode.extensions.getExtension('iceworks-team.iceworks-doctor');
      const isTargetProject = !(await checkIsNotTarget());
      const isO2 = checkIsO2();
      return isO2 ? isTargetProject : doctorExtension && isTargetProject;
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.runDebug.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.runDebug.detail'),
    command: 'iceworksApp.editorMenu.runDebug',
    async condition() {
      return !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.DefPublish.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.DefPublish.detail'),
    command: 'iceworksApp.editorMenu.DefPublish',
    async condition() {
      return (await checkIsAliInternal()) && !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.generatePage.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.generatePage.detail'),
    command: 'iceworks-material-helper.page-generator.start',
    async condition() {
      return !(await checkIsNotTarget()) && !(await checkIsPegasusProject());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.createPage.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.createPage.detail'),
    command: 'iceworks-material-helper.page-creator.start',
    async condition() {
      return !(await checkIsNotTarget()) && !(await checkIsPegasusProject());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.materialImport.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.materialImport.detail'),
    command: 'iceworks-material-helper.material-importer.start',
    async condition() {
      return !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.generateComponent.detail'),
    command: 'iceworks-ui-builder.design-component',
    async condition() {
      const projectType = await getProjectType();
      return projectType === 'react';
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.createComponent.detail'),
    command: 'iceworks-material-helper.component-creator.start',
    async condition() {
      return !(await checkIsNotTarget()) && !(await checkIsPegasusProject());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.showMaterialDocs.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.showMaterialDocs.detail'),
    command: 'iceworks-material-helper.showMaterialDocs',
    async condition() {
      return !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.reinstall.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.reinstall.detail'),
    command: 'iceworksApp.nodeDependencies.reinstall',
    async condition() {
      return !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.addDepsAndDevDeps.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.addDepsAndDevDeps.detail'),
    command: 'iceworksApp.nodeDependencies.addDepsAndDevDeps',
    async condition() {
      return !(await checkIsNotTarget());
    },
  },
  {
    label: i18n.format('extension.iceworksApp.showEntriesQuickPick.runBuild.label'),
    detail: i18n.format('extension.iceworksApp.showEntriesQuickPick.runBuild.detail'),
    command: 'iceworksApp.editorMenu.runBuild',
    async condition() {
      return !(await checkIsNotTarget());
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
];

export default async function () {
  const conditionResults = await Promise.all(
    entries.map(async ({ condition }) => {
      if (condition) {
        const result = await condition();
        return result;
      } else {
        return true;
      }
    }),
  );

  return entries.filter((v, index) => conditionResults[index]);
}
