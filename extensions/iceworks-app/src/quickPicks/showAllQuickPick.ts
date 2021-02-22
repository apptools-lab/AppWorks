import * as vscode from 'vscode';
import options from './options';
import getOptions from '../utils/getOptions';

const { window, commands } = vscode;

export default async function showAllQuickPick() {
  const quickPick = window.createQuickPick();
  const entryOptions = await getOptions(options);
  quickPick.items = entryOptions;
  quickPick.onDidChangeSelection((selection) => {
    if (selection[0]) {
      const currentExtension = entryOptions.find((option) => option.label === selection[0].label)!;
      commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
