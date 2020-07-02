import * as vscode from 'vscode';

const { window } = vscode;

export const openCommandPaletteCommandId = 'iceworksApp.openVSCodePanel';

export function createStatusBarItem() {
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = 'Iceworks';
  statusBarItem.command = openCommandPaletteCommandId;
  statusBarItem.show();
  return statusBarItem;
}
const extensionOptions = [
  { label: 'Iceworks 创建应用', detail: '快速创建多端应用（例如：React/Rax/Vue...）', command: 'iceworks-project-creator.start', },
  { label: 'Iceworks 生成页面', detail: '使用低代码的方式生成网页视图', command: 'iceworks-page-builder.create', },
  { label: 'Iceworks 生成组件', detail: '使用低代码的方式生成前端组件', command: 'iceworks-component-builder.generate' },
]

export function registerOpenCommandPalette() {
  const quickPick = window.createQuickPick();
  quickPick.items = extensionOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      const currentExtension = extensionOptions.find(option => option.label === selection[0].label)!;
      vscode.commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}