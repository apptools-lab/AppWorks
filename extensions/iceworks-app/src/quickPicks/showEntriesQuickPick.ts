import * as vscode from 'vscode';
import getQuickEntryOptions from '../getQuickEntryOptions';

const { window, commands } = vscode;

export default async function showEntriesQuickPick() {
  const quickPick = window.createQuickPick();
  const entryOptions = await getQuickEntryOptions();
  quickPick.items = entryOptions.map((options) => ({ label: options.label, detail: options.detail }));
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
