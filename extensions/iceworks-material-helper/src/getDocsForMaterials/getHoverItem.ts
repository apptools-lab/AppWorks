import * as vscode from 'vscode';
import { getSource } from './sourceManager';
import { IQuickPickInfo, SourceType } from './type';

export default function getHoverItem(tagName: string) {
  const materialInfos = getSource(SourceType.QUICK_PICK_INFO) as IQuickPickInfo[];
  const tagInfo = materialInfos.find((info) => {
    return info.label === tagName;
  });
  if (tagInfo) {
    const commandUri = vscode.Uri.parse(`command:${getSource(SourceType.COMMAND)[tagInfo.homepage]}`,true);
    const docsLink = new vscode.MarkdownString(`[Docs for ${tagInfo.label}](${commandUri}) `);
    // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
    // https://code.visualstudio.com/api/extension-guides/command
    docsLink.isTrusted = true;
    return new vscode.Hover(docsLink);
  }
}
