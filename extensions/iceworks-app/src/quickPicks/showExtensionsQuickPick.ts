import * as vscode from 'vscode';

const { window, commands } = vscode;

const extensionOptions = [
  { label: 'Iceworks 创建应用', detail: '快速创建多端应用（例如：React/Rax/Vue...）', command: 'iceworks-project-creator.start', },
  { label: 'Iceworks 生成页面', detail: '使用低代码的方式生成网页视图', command: 'iceworks-page-builder.create', },
  { label: 'Iceworks 生成组件', detail: '使用低代码的方式生成前端组件', command: 'iceworks-component-builder.generate' },
  { label: 'Iceworks 使用物料', detail: '使用可视化的方式添加物料到应用中', command: 'iceworks-material-import.start' },
]

export default function showExtensionsQuickPick() {
  const quickPick = window.createQuickPick();
  quickPick.items = extensionOptions.map((options) => ({ label: options.label, detail: options.detail }));
  quickPick.onDidChangeSelection(selection => {
    if (selection[0]) {
      const currentExtension = extensionOptions.find(option => option.label === selection[0].label)!;
      commands.executeCommand(currentExtension.command);
      quickPick.dispose();
    }
  });
  quickPick.onDidHide(() => quickPick.dispose());
  quickPick.show();
}
