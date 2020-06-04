import * as path from 'path';
import * as fse from 'fs-extra';
import * as vscode from 'vscode';
import { Terminal, TerminalOptions } from 'vscode';
import { entryFileSuffix } from './constants';
import { ITerminalMap } from './types';

export function createTerminalName(cwd: string, command: string): string {
  return `${path.basename(cwd)} - ${command}`;
}

export function pathExists(p: string) {
  try {
    fse.accessSync(p);
  } catch (err) {
    return false;
  }
  return true;
}

export function executeCommand(terminalMapping: ITerminalMap, script: vscode.Command) {
  if (!script.arguments) {
    return;
  }
  const args = script.arguments;
  const [cwd, command] = args;
  let terminalName = args[2];
  if (!command) {
    return;
  }
  terminalName = terminalName || command;
  const name: string = createTerminalName(cwd, terminalName);

  let terminal: Terminal;

  if (terminalMapping.has(name)) {
    terminal = terminalMapping.get(name)!;
  } else {
    const terminalOptions: TerminalOptions = { cwd, name };
    terminal = vscode.window.createTerminal(terminalOptions);
    terminalMapping.set(name, terminal);
  }

  terminal.show();
  terminal.sendText(command);
}

export function openEntryFile(p: string) {
  const currentSuffix = entryFileSuffix.find(suffix => pathExists(path.join(p, `index${suffix}`)));
  if (currentSuffix) {
    const resource = vscode.Uri.file(path.join(p, `index${currentSuffix}`));
    vscode.window.showTextDocument(resource);
  } else {
    vscode.window.showErrorMessage('Entry file not found.');
  }
}

export function createNpmCommand(action: string, target: string = '', extra: string = ''): string {
  const packageManager = getCurrentPackageManager();
  let register = '';
  if (!(packageManager === 'cnpm' || packageManager === 'tnpm' || action === 'run')) {
    register = `--register=${getCurrentNpmRegister()}`;
  }
  return `${packageManager} ${action} ${target} ${register} ${extra}`;
}

export function getCurrentPackageManager() {
  const packageManagers = getPackageManagers();
  return vscode.workspace.getConfiguration('iceworks').get('packageManager', packageManagers[0]);
}

export function getCurrentNpmRegister(): string {
  const npmRegisters = getNpmRegisters();
  return vscode.workspace.getConfiguration('iceworks').get('npmRegister', npmRegisters[0]);
}

export function getPackageManagers() {
  const packageJsonPath: string = path.join(__filename, '..', '..', 'package.json');
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.contributes.configuration.properties['iceworks.packageManager'].enum;
}

export function getNpmRegisters() {
  const packageJsonPath: string = path.join(__filename, '..', '..', 'package.json');
  const packageJson = JSON.parse(fse.readFileSync(packageJsonPath, 'utf-8'));
  return packageJson.contributes.configuration.properties['iceworks.npmRegister'].enum;
}