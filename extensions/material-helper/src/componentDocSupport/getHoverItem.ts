import * as vscode from 'vscode';
import { getDocInfos } from './docInfoCache';
import i18n from '../i18n';

export default function getHoverItem(tagName: string, source: string) {
  const docInfos = getDocInfos();
  const tagInfo = docInfos.find((info) => {
    return info.label === tagName && info.source.npm === source;
  });
  if (tagInfo) {
    const docsLink = new vscode.MarkdownString(
      i18n.format('extension.iceworksMaterialHelper.getHoverItem.hoverItemLink', {
        componentName: tagInfo.label,
        commandUri: tagInfo.url,
      }),
    );
    // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
    // https://code.visualstudio.com/api/extension-guides/command
    docsLink.isTrusted = true;
    return new vscode.Hover(docsLink);
  }
}
