import * as vscode from 'vscode';
import runScript from '../terminal/runScript';
import { getProjectPackageJSON } from '@appworks/project-service/lib/utils';
import checkHasTypesRax from './checkHasTypesRax';
import checkIsRaxTsProject from './checkIsRaxTsProject';
import { projectPath } from '@appworks/project-service';
import { createNpmCommand, getAddDependencyAction } from '@appworks/common-service';

/**
 * 检测是否需要提示用户安装 @types/rax
 * @returns
 */
async function checkIsShowTip(): Promise<boolean> {
  const projectPackageJSON = await getProjectPackageJSON();
  return checkIsRaxTsProject() && !checkHasTypesRax(projectPackageJSON);
}

/**
 * 根据用户的选择，自动安装@types/rax
 * @param value
 */
async function installTypesRax(value: string | undefined) {
  if (value === '安装') {
    const terminalName = 'install @typesRax';
    const npmCommandAction = getAddDependencyAction();

    const script = createNpmCommand(npmCommandAction, '@types/rax', '--save-dev');
    runScript(terminalName, projectPath, script);
  }
}

export default async () => {
  if (await checkIsShowTip()) {
    vscode.window.showInformationMessage('检测到您未安装 @types/rax。为获得更好的代码提示，建议您安装。', '安装', '忽略').then(
      (value) => installTypesRax(value),
    );
  }
};

