import { getDataFromSettingJson } from './vscode';

export function isYarnPackageManager(): boolean {
  const packageManager = getDataFromSettingJson('packageManager', 'npm');
  const isYarn = packageManager === 'yarn';
  return isYarn;
}

export function getAddDependencyAction(): 'add' | 'install' {
  return isYarnPackageManager() ? 'add' : 'install';
}
