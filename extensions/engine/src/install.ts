import * as vscode from 'vscode';
import * as iceworksConfig from '@iceworks/config';
import setTerminal from './setTerminal';

export default function start(): void {
  const { npmClient, registry } = iceworksConfig.get();
  const cmd = `${npmClient} install ${registry ? `--registry ${registry}` : ''}`;

  vscode.window.showInformationMessage('start install...');
  setTerminal(cmd);
};
