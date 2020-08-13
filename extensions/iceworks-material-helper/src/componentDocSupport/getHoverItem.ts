import * as vscode from 'vscode';
import { getDocInfos } from './docInfoCache';
import i18n from '../i18n';

export default function getHoverItem(tagName: string) {
  const docInfos = getDocInfos();
  const tagInfo = docInfos.find((info) => {
    return info.label === tagName;
  });
  if (tagInfo) {
    const commandUri = vscode.Uri.parse(`command:${tagInfo.command}`, true);
    const docsLink = new vscode.MarkdownString(
      i18n.format('extension.iceworksMaterialHelper.getHoverItem.hoverItemLink', {
        componentName: tagInfo.label,
        commandUri,
      })
    );
    // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
    // https://code.visualstudio.com/api/extension-guides/command
    docsLink.isTrusted = true;
    return new vscode.Hover(docsLink);
  }
}
