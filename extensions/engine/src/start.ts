import * as vscode from 'vscode';
import setTerminal from './setTerminal';

export default function start(): void {
  const { commands, workspace } = vscode;
  const configuration = workspace.getConfiguration();

  // if (!isRaxProject()) {
  //   window.showErrorMessage('Please open Rax project!');
  //   return false;
  // }
  setTerminal('npm run start');

  // TODO：
  // 1. start 失败了
  // 2. 浏览器也打开了一个窗口
  // 3. 打开浏览器的时机：不知道 start 完成了
  // 4. 窗口太小了
  // 总结：感觉没啥用
  // setTimeout(() => {
  //   if (configuration.get('iceworks.showPreview')) {
  //     commands.executeCommand(
  //       'browser-preview.openPreview',
  //       configuration.get('iceworks.previewUrl')
  //     );
  //   }
  // }, 3 * 1000);
};
