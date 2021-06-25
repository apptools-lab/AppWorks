import * as vscode from 'vscode';
import runScript from '../terminal/runScript';
import { getProjectPackageJSON } from '@appworks/project-service/lib/utils';
import checkHasTypesRax from './checkHasTypesRax';
import checkIsRaxTsProject from './checkIsRaxTsProject';
import { projectPath } from '@appworks/project-service';
import { createNpmCommand, getAddDependencyAction } from '@appworks/common-service';
import { Recorder } from '@appworks/recorder';
import i18n from '../i18n';

/**
 * 检测是否需要提示用户安装 @types/rax
 * @returns
 */
async function checkIsShowTip(): Promise<boolean> {
  const projectPackageJSON = await getProjectPackageJSON();
  return await checkIsRaxTsProject() && !checkHasTypesRax(projectPackageJSON);
}

/**
 * 根据用户的选择，自动安装@types/rax
 * @param value
 */
async function installTypesRax(value: string | undefined, recorder: Recorder) {
  if (value === i18n.format('extension.applicationManager.hintInstallTypesrax.message.install')) {
    recorder.record({
      action: 'actualInstall',
      module: 'hintInstallTypesRax',
    });
    const terminalName = 'install @typesRax';
    const npmCommandAction = getAddDependencyAction();

    const script = createNpmCommand(npmCommandAction, '@types/rax', '--save-dev');
    runScript(terminalName, projectPath, script);
  }
}

export default async (recorder: Recorder) => {
  if (await checkIsShowTip()) {
    recorder.record({
      action: 'showInstallTip',
      module: 'hintInstallTypesRax',
    });
    vscode.window
      .showInformationMessage(
        i18n.format('extension.applicationManager.hintInstallTypesrax.message'),
        i18n.format('extension.applicationManager.hintInstallTypesrax.message.install'),
        i18n.format('extension.applicationManager.hintInstallTypesrax.message.ignore'),
      )
      .then((value) => installTypesRax(value, recorder));
  }
};
